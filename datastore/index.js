const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

//var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  counter.getNextUniqueId(function(err, counterString) {
    if (err) {
      callback(err);
    } else {
      //./datastore/data/0001.txt
      var textPath = path.join(exports.dataDir, counterString + '.txt');
      fs.writeFile( textPath, text, function(err){
        if (err) {
          callback(err);
        } else {
          callback(null, {id: counterString, text: text});
        }
      });
    }
  });
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
  fs.readdir(exports.dataDir, function(err, files) {
    if (err) {
      callback(err);
    } else {
      _.each(files, function(fileName) {
        var id = fileName.split('.txt')[0];
        data.push({id: id, text: id});
      });
      callback(null, data);
    }
  });
  //==============below is the Promise code=======================
  //fs.readdirAsync to get all file names => ['0001.txt',...]
  //.then make an array of file links using path.join => dirname + filename => [../0001.txt, ...]
  //make each file path into a fs.readFile promise => [fs.readFileAsync(path), ...]
  //Promise.all of the fs.readFile asyncs
  //after each fs.readFile, push file content string into data
  //.then callback the data array

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
  fs.readFile(textPath, 'utf8' , function (err, text){
    if (err) {
      callback(err);
    } else {
      callback(null,{id, text});
    }
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
  fs.stat(textPath, function(err, stats) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile( textPath, text, function(err){
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      });
    }
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
  fs.stat(textPath, function (err, stats) {
    if (err)  {
      callback(err);
    } else {
      fs.unlink(textPath, function (err){
        if (err) {
          callback(err);
        } else {
          callback(null, stats);
        }
      });  
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
