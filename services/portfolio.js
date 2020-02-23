'use strict';

const Util = require('../util');

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
          console.log(err);
          reject(err);
        }
        resolve(data);
      });
  });

  let result = await promise;

  return Util.response(event, 200, {
    status: "ok",
    data: result
  });
};
