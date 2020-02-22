'use strict';

const mongoose = require('mongoose');
const Util = require('../util');
const request = require('request');
const Contact = require('../models/contact');
const sgMail = require('@sendgrid/mail');

require('dotenv').config();

module.exports.post = async event => {
    mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true });

    var data = JSON.parse(event.body);

    if (!data ||
        !(data.fullname && data.fullname.trim()) ||
        !(data.email && data.email.trim()) ||
        !(data.message && data.message.trim())) {
        return Util.response(400, {
            status: "Bad Request",
            message: "Invalid Request"
        });
    }

    if (data['g-recaptcha-response'] === undefined || data['g-recaptcha-response'] === '' || data['g-recaptcha-response'] === null) {
        //Send JSON response
        console.log(`The Captcha wasn't solved`);
        return Util.response(400, {
            status: "Bad Request",
            message: "Please select Captcha"
        });
    }

    var secretKey = process.env.GOOGLE_RECAPTCHA_KEY;

    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + data['g-recaptcha-response'] + "&remoteip=" + event['requestContext']['identity']['sourceIp'];

    let promise = new Promise(resolve => {
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl, function (error, response, body) {
            if (error) {
                resolve(Util.response(500, {
                    status: "Internal Server Error"
                }));
            }

            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if (body.success !== undefined && !body.success) {
                console.log('Captcha Verification failed');
                resolve(Util.response(400, {
                    status: "Bad Request",
                    message: "Captcha Verification failed"
                }));
            }


            Contact.create(data, function (err, small) {
                if (err) {
                    resolve(Util.response(500, {
                        statusCode: 500,
                        status: "Inter"
                    }));
                }

                //Send email
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                const msg = {
                    to: process.env.ADMIN_EMAIL,
                    from: {
                        'name': 'Royden Rego',
                        'email': 'no-reply@roydenrego.com',
                    },
                    replyTo: data.email,
                    subject: 'Royden Rego - ContactForm',
                    text: 'You have a new contact form submission',
                    html: '<p>You have a new contact form submission</p>' +
                        '<p>Full Name: ' + data.fullname + '</p>' +
                        '<p>Email: ' + data.email + '</p>' +
                        '<p>Message: ' + data.message + '</p>',
                };
                sgMail.send(msg);

                const usrMsg = {
                    to: data.email,
                    from: {
                        'name': 'Royden Rego',
                        'email': 'no-reply@roydenrego.com',
                    },
                    replyTo: process.env.ADMIN_EMAIL,
                    subject: 'Contact Form - Royden Rego',
                    text: 'Hi ' + data.fullname + ', I have received your message and will revert back to you as soon as I can.',
                    html: '<p>Hi ' + data.fullname + ',</p>' +
                        '<p>I have received your message and will revert back to you as soon as I can.</p>' +
                        '<p>Warm Regards<br>Royden Rego</p>' +
                        '<p>Disclaimer: This is a automated message sent automatically by the system. Please do not reply to this email since there is no person monitoring this email address.</p>',
                };
                sgMail.send(usrMsg);

                //Send JSON response
                resolve(Util.response(200, { status: "ok", data: {} }));

            });
        })

    });

    return await promise;
};
