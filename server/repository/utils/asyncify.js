'use strict'

const asyncify = fn => (...args) => new Promise(
  (resolve, reject) => fn(...args,
    (err, data) => err === null ? resolve(data) : reject(err))
);

module.exports = { asyncify };
