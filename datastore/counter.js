const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
Promise.promisifyAll(fs);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  const textPath = exports.counterFile;
  //=============below is the nodestyle callback code=============
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
  //==============below is the Promise code=======================
  //return fs.readfileAsync pass in textPath
  //if sucessful, call then() method and pass in Number(fileData)
  //if not, catch()
  return fs.readFileAsync(textPath)
    .then(function (fileData) {
      callback(Number(fileData));
    })
    .catch(function (err) {
      callback(0);
    });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  const textPath = exports.counterFile;
  //=============below is the nodestyle callback code=============
  // fs.writeFile(exports.counterFile, counterString, (err) => {
  //   if (err) {
  //     throw ('error writing counter');
  //   } else {
  //     callback(null, counterString);
  //   }
  // });
  //==============below is the Promise code=======================
  //return fs.writeFileAsync promise
  // then callback on the counterString
  return fs.writeFileAsync(textPath, counterString)
    .then(function() {
      callback(counterString);
    })
    .catch(function(err) {
      callback(err);
    });
};

// Public API - Fix this function //////////////////////////////////////////////

// exports.getNextUniqueId = () => {
//   counter = counter + 1;
//   return zeroPaddedNumber(counter);
// };

exports.getNextUniqueId = (callback) => {
  //=============below is the nodestyle callback code=============
  // readCounter(function(err, counterNum) {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     //counterNum = counterNum++;
  //     writeCounter(counterNum + 1, function(err, counterString) {
  //       if (err) {
  //         throw ('error writing counter');
  //       } else {
  //         //zeroPaddedNumber(counterNum+1);
  //         callback(null, counterString);
  //       }
  //     }); 
  //   }
  // });
  //==============below is the Promise code=======================
  //return readCounter
  //.then()
  //return writeCounter
  //.then(counterNum+1)
  //.catch()
  return readCounter()
    .then( function (counterNum) {
      console.log('counterNum is ============>' + counterNum);
      return writeCounter(counterNum + 1);
    })
    .then(function (counterString) {
      console.log('counterString is ===============>' + counterString);
      callback(counterString);
    })
    .catch(function (err) {
      callback(null, 0);
    });
};




// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
