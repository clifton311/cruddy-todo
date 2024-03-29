const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const getNextUniqueIdAsync = Promise.promisify(counter.getNextUniqueId);
Promise.promisifyAll(fs);

//var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // // var id = counter.getNextUniqueId();
  // // items[id] = text;
  // // callback(null, { id, text });
  //=============below is the nodestyle callback code================
  // counter.getNextUniqueId(function(err, counterString) {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     //./datastore/data/0001.txt
  //     var textPath = path.join(exports.dataDir, counterString + '.txt');
  //     fs.writeFile( textPath, text, function(err){
  //       if (err) {
  //         callback(err);
  //       } else {
  //         callback(null, {id: counterString, text: text});
  //       }
  //     });
  //   }
  // });
  
  //========================== exports.create Using Promises=========================
  return getNextUniqueIdAsync()
    .then(function (counterString) {
      var textPath = path.join(exports.dataDir, counterString + '.txt');
      return new Promise(function (resolve, reject) {
        fs.writeFile(textPath, text, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({id: counterString});
          }
        });
      });
    })
    .then(function (textObj) {
      textObj.text = text;
      callback(null, textObj);
    })
    .catch(function (err) {
      console.log( 'Error ' + err);
    });

  //return counter
  //.then(callback) 
  //define the textpath
  //promise the fs.writeFile
  //then callback passing in the text and id
};


exports.readAll = (callback) => {
  var data = [];
  // _.each(items, (text, id) => {
  //   data.push({ id, text });
  // });
  // callback(null, data);

  //read all file names in ./datastore/data directory
  //push the file name obj into data array {id: '0001', text: '0001'}
  //0001.txt => 0001
  //files = [0001.txt, 0002.txt...]
  //=============below is the nodestyle callback code=============
  // fs.readdir(exports.dataDir, function(err, files) {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     _.each(files, function(fileName) {
  //       var id = fileName.split('.txt')[0];
  //       data.push({id: id, text: id});
  //     });
  //     callback(null, data);
  //   }
  // });
  //==============below is the Promise code=======================
  //fs.readdirAsync to get all file names => ['0001.txt',...]
  //.then make an array of file links using path.join => dirname + filename => [../0001.txt, ...]
  //make each file path into a fs.readFile promise => [fs.readFileAsync(path), ...]
  //Promise.all of the fs.readFile asyncs
  //after each fs.readFile, push file content string into data
  //.then callback the data array
  return fs.readdirAsync(exports.dataDir)
    .then(function(fileNames) {
      return Promise.all(fileNames.map(function(fileName) {
        var filePath = path.join(exports.dataDir, fileName); //path: .././0001.txt
        var id = fileName.split('.txt')[0]; //id: 0001
        return fs.readFileAsync(filePath, 'utf8') //returns body of the file in a string: 'todo 1'
          .then(function(text) {
            data.push({id: id, text: text});
          });
      }));
    })
    .then(function() {
      callback(null, data);
    })
    .catch(function(err) {
      console.log('read all error: ' + err);
    });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  //id = 0001, read content from path 'exports.dataDir + 0001.txt'
  //fs.readFile(path, callback)
  //handle when path doesn't exist
  //when successful, callback(null, { id, text });

  var textPath = path.join(exports.dataDir, id + '.txt');
  //=============below is the nodestyle callback code=============
  // fs.readFile(textPath, 'utf8' , function (err, text){
  //   if (err) {
  //     callback(err);
  //   } else {
  //     callback(null,{id, text});
  //   }
  // });

  //==============below is the Promise code=======================
  //use fs.readfileAsync to create the promise
  //then method to callback
  //catch the error
  return fs.readFileAsync(textPath, 'utf8')
    .then(function (text) {
      callback(null, {id, text});
    })
    .catch(function (err) {
      callback(err);
    });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  //use the fs.writefile method to edit the todo
  //check if path exists, only writeFile when path exists

  var textPath = path.join(exports.dataDir, id + '.txt');
  //=============below is the nodestyle callback code=============
  //fs.stat checks if the path exists

  // fs.stat(textPath, function(err, stats) {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     fs.writeFile( textPath, text, function(err){
  //       if (err) {
  //         callback(err);
  //       } else {
  //         callback(null, {id, text});
  //       }
  //     });
  //   }
  // });
  //==============below is the Promise code=======================
  //return fs.statAsync promise
  //if successful, fs.stat returns a stats obj (we don't need to pass stats)
  //.then return fs.writeFileAsync promise
  //.then call back on {id, text}
  return fs.statAsync(textPath)
    .then(function() {
      return fs.writeFileAsync(textPath, text);
    })
    .then(function() {
      callback({id, text});
    })
    .catch(function(err) {
      callback(err);
    });

};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  //use the fs.unlink method - Asynchronously removes a file or symbolic link
  //check if path exists, only unlink when path exists
  var textPath = path.join(exports.dataDir, id + '.txt');

  //=============below is the nodestyle callback code=============
  // fs.stat(textPath, function (err, stats) {
  //   if (err)  {
  //     callback(err);
  //   } else {
  //     fs.unlink(textPath, function (err){
  //       if (err) {
  //         callback(err);
  //       } else {
  //         callback(null, stats);
  //       }
  //     });  
  //   }
  // });
  
  //==============below is the Promise code=======================
  //return fs.statAsync promise and pass in textPath
  //if successful return a statsObj,
  //call the then() method 
  //return the fs.unlinkAsync promise
  //else catch the error

  return fs.statAsync(textPath)
    .then(function (statsObj) {
      return fs.unlinkAsync (textPath);
    })
    .then(function() {
      callback();
    })
    .catch(function (err) {
      callback(err);
    });
};
// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
