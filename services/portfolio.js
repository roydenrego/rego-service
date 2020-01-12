'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

module.exports.get = async event => {
  mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true });

  let promise = new Promise((resolve, reject) => {
    const Project = require('../models/project');

    Project.find({})
      .sort({ created_at: -1 })
      .exec((err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
  });

  let result = await promise;

  return {
    statusCode: 200,
    body: JSON.stringify({
      statusCode: 200,
      status: "ok",
      data: result
    },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
