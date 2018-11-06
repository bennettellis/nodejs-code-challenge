'use strict';

const fs = require('fs');
const OrderConverter = require("./order-converter");
const path = require('path');

const originalData = require('./data');

// get output directory or use current directory
const outputDir = process.env.CHALLENGE_OUTPUT_DIR || __dirname;

console.log(`Output will be sent to ${outputDir}`);

/**
 * Transform data from old to new format
 * @param data in the form of [{"id": 1, "vendor": "acme", "date": "03/03/2017", "customer": {"id": "8baa6d..."},"order": {"item1": {"quantity": 14,"price": 8},...}},...]
 * @returns {Promise<[]>} promise to resolve to data array with new format or rejection
 */
const transformData = (data) => {
  const orderConverter = new OrderConverter();
  return Promise.all(data.map((orderData) => {
      return new Promise((resolve, reject) => {
        return resolve(orderConverter.reformatOrder(orderData));
      });
    }))
    .then(convertedOrders => {
      return convertedOrders;
    });
};

/**
 * Writes data to "data-transformed.json" in current directory
 * @param outputData
 * @returns {Promise<>} promise to resolve after writing data array to file or rejection
 */
const writeTransformedData = (outputData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(outputDir, 'data-transformed.json'), outputData + '\n', function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 *
 * @returns {Promise<[]>} promise to have completed the work of transformation and output or log of errors
 */
const run = () => {
  console.log("starting order conversions...");
  return transformData(originalData)
    .then(data => {
      console.log("finished converting orders to new format.");
      console.log("starting writing converted orders...");
      return writeTransformedData(JSON.stringify(data, null, 1))
        .then(() => {
          console.log("finished writing converted orders.");
        })
        .catch(err => {
          console.log("Error while writing data", err);
        });
    })
    .catch(err => {
      console.log("Error encountered while converting data", err);
    });
};

// run the solution
run();



