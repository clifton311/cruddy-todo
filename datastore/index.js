const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

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
      fs.writeFile(textPath, text, function(err){
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
  fs.readdir(exports.dataDir, function(err, files) {
    if (err) {
      callback(err);
    } else {
      _.each(files, function(fileName) {
        var id = fileName.split(".txt")[0];
        data.push({id: id, text: id});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
