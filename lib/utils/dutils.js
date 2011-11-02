(function() {
  var CSV2JS, DataColl, DataGen, FileUpload, S3File, ascBy, auth_key, auth_secret, convertToCSV, crypto, descBy, dynamicSort, fileUpload, getUploadParams, parseFile, request, sanitize, template_id, toJS;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  exports.requiresLogin = function(req, res, next) {
    var sessionUrl, url, _ref;
    url = req.url.split('/')[1];
    sessionUrl = (_ref = req.session) != null ? _ref.url : void 0;
    if ((sessionUrl != null) && url === sessionUrl) {
      return next();
    } else {
      return res.redirect('/login');
    }
  };
  dynamicSort = function(property) {
    var func;
    func = function(a, b) {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
    return func;
  };
  exports.ascBy = ascBy = function(arr, property) {
    return arr.sort(dynamicSort(property));
  };
  exports.descBy = descBy = function(arr, property) {
    return arr.sort(dynamicSort(property)).reverse();
  };
  crypto = require('crypto');
  sanitize = require("validator").sanitize;
  auth_key = '1580cee65f904f7399ca08a1a844cfab';
  auth_secret = '61b3703ab1a24f1b8be97b73dc2b33c50a2260a0';
  template_id = 'b902f75dba8a4fadb054ab068e705b97';
  exports.getUploadParams = getUploadParams = function(doneUrl) {
    var cDay, cHours, cMinutes, cMonth, cSeconds, cYear, d, dn, encodedParams, expiration, hash, params, paramsStr;
    dn = new Date();
    d = new Date(dn.getTime() + 25200000 + 600000);
    cDay = d.getDate().toString();
    if (cDay.length === 1) {
      cDay = "0" + cDay;
    }
    cMonth = d.getMonth().toString();
    cMonth++;
    if (cMonth.length === 1) {
      cMonth = "0" + cMonth;
    }
    cYear = d.getFullYear().toString();
    cHours = d.getHours();
    if (cHours.length === 1) {
      cHours = "0" + cHours;
    }
    cMinutes = d.getMinutes().toString();
    if (cMinutes.length === 1) {
      cMinutes = "0" + cMinutes;
    }
    cSeconds = d.getSeconds().toString();
    if (cSeconds.length === 1) {
      cSeconds = "0" + cSeconds;
    }
    expiration = cYear + "/" + cMonth + "/" + cDay + " " + cHours + ":" + cMinutes + ":" + cSeconds;
    params = {
      auth: {
        expires: expiration,
        key: auth_key
      },
      template_id: template_id,
      redirect_url: doneUrl
    };
    paramsStr = JSON.stringify(params);
    encodedParams = sanitize(paramsStr).entityEncode();
    hash = crypto.createHmac("sha1", auth_secret).update(paramsStr).digest("hex");
    return [encodedParams, paramsStr, hash];
  };
  getUploadParams("2011/11/01 16:53:14", "http://localhost:3000/test/done");
  S3File = (require('./s3file')).S3File;
  CSV2JS = require('./CSV2JS');
  toJS = CSV2JS.csvToJs;
  DataColl = (require('../models/commonModels')).DataColl;
  request = require("request");
  FileUpload = (require('../models/commonModels')).FileUpload;
  fileUpload = new FileUpload;
  DataGen = (require("../utils/dataGen")).DataGen;
  exports.parseFile = parseFile = function(collectionName, url) {
    return request(url, __bind(function(error, response, body) {
      var account, arrurl, fileName, result, s, s3, s3url;
      if (error) {
        console.log(url, error);
      }
      if (!error && response.statusCode === 200) {
        result = JSON.parse(body);
        s3url = result.results[':original'][0].url;
        arrurl = s3url.split('/');
        account = arrurl[3];
        fileName = '/' + arrurl[4] + '/' + arrurl[5];
        s = arrurl[5].split('.')[0];
        collectionName += s[0].toUpperCase() + s.slice(1, (s.length + 1) || 9e9);
        s3 = new S3File(account, fileName);
        return s3.get(__bind(function(err, res) {
          var dataColl, parsedRet;
          if (err) {
            return console.log(err);
          } else {
            parsedRet = toJS(res);
            if (parsedRet.error) {
              console.log("Parse Error: ", parsedRet.error, parsedRet.message);
            }
            dataColl = new DataColl(collectionName, {
              id: ' '
            });
            return dataColl.removeAll(__bind(function() {
              return dataColl.save(parsedRet.data, __bind(function(err, result) {
                if (err) {
                  return console.log("Error saving data after parsing: ", err);
                } else {
                  return dataColl.count(__bind(function(err, count) {
                    if (err) {
                      console.log("Parse Count: " + err);
                    }
                    console.log("Saved " + count + " rows to " + collectionName + " collection after parsing the file: " + arrurl[5]);
                    return fileUpload.remove({
                      assembly_url: url
                    }, function(err, success) {
                      if (err) {
                        return console.log(err);
                      } else {
                        return console.log("removed row");
                      }
                    });
                  }, this));
                }
              }, this));
            }, this));
          }
        }, this));
      }
    }, this));
  };
  exports.saveDonorsView = function(numRows, url, callback) {
    var columns, data, dataGen, maleNames, nameCount, surNames, surnameCount, transforms;
    maleNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Charles', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Paul', 'Mark', 'Donald', 'George', 'Kenneth', 'Steven', 'Edward', 'Brian', 'Ronald', 'Anthony', 'Kevin', 'Jason', 'Matthew', 'Gary', 'Timothy', 'Jose', 'Larry', 'Jeffrey', 'Frank', 'Scott', 'Eric', 'Stephen', 'Andrew', 'Raymond', 'Gregory', 'Joshua', 'Jerry', 'Dennis', 'Walter', 'Patrick', 'Peter', 'Harold', 'Douglas', 'Henry', 'Carl', 'Arthur', 'Ryan', 'Roger', 'Joe', 'Juan', 'Jack', 'Albert', 'Jonathan', 'Justin', 'Terry', 'Gerald', 'Keith', 'Samuel', 'Willie', 'Ralph', 'Lawrence', 'Nicholas', 'Roy', 'Benjamin', 'Bruce', 'Brandon', 'Adam', 'Harry', 'Fred', 'Wayne', 'Billy', 'Steve', 'Louis', 'Jeremy', 'Aaron', 'Randy', 'Howard', 'Eugene', 'Carlos', 'Russell', 'Bobby', 'Victor', 'Martin', 'Ernest', 'Phillip', 'Todd', 'Jesse', 'Craig', 'Alan', 'Shawn', 'Clarence', 'Sean', 'Philip', 'Chris', 'Johnny', 'Earl', 'Jimmy', 'Antonio', 'Danny', 'Bryan', 'Tony', 'Luis', 'Mike', 'Stanley', 'Leonard', 'Nathan', 'Dale', 'Manuel', 'Rodney', 'Curtis', 'Norman', 'Allen', 'Marvin', 'Vincent', 'Glenn', 'Jeffery', 'Travis', 'Jeff', 'Chad', 'Jacob', 'Lee', 'Melvin', 'Alfred', 'Kyle', 'Francis', 'Bradley', 'Jesus', 'Herbert', 'Frederick', 'Ray', 'Joel', 'Edwin', 'Don', 'Eddie', 'Ricky', 'Troy', 'Randall', 'Barry', 'Alexander', 'Bernard', 'Mario', 'Leroy', 'Francisco', 'Marcus', 'Micheal', 'Theodore', 'Clifford', 'Miguel', 'Oscar', 'Jay', 'Jim', 'Tom', 'Calvin', 'Alex', 'Jon', 'Ronnie', 'Bill', 'Lloyd', 'Tommy', 'Leon', 'Derek', 'Warren', 'Darrell', 'Jerome', 'Floyd', 'Leo', 'Alvin', 'Tim', 'Wesley', 'Gordon', 'Dean', 'Greg', 'Jorge', 'Dustin', 'Pedro', 'Derrick', 'Dan', 'Lewis', 'Zachary', 'Corey', 'Herman', 'Maurice', 'Vernon', 'Roberto', 'Clyde', 'Glen', 'Hector', 'Shane', 'Ricardo', 'Sam', 'Rick', 'Lester', 'Brent', 'Ramon', 'Charlie', 'Tyler', 'Gilbert', 'Gene', 'Marc', 'Reginald', 'Ruben', 'Brett', 'Angel', 'Nathaniel', 'Rafael', 'Leslie', 'Edgar', 'Milton', 'Raul', 'Ben', 'Chester', 'Cecil', 'Duane', 'Franklin', 'Andre', 'Elmer', 'Brad', 'Gabriel', 'Ron', 'Mitchell', 'Roland', 'Arnold', 'Harvey', 'Jared', 'Adrian', 'Karl', 'Cory', 'Claude', 'Erik', 'Darryl', 'Jamie', 'Neil', 'Jessie', 'Christian', 'Javier', 'Fernando', 'Clinton', 'Ted', 'Mathew', 'Tyrone', 'Darren', 'Lonnie', 'Lance', 'Cody', 'Julio', 'Kelly', 'Kurt', 'Allan', 'Nelson', 'Guy', 'Clayton', 'Hugh', 'Max', 'Dwayne', 'Dwight', 'Armando', 'Felix', 'Jimmie', 'Everett', 'Jordan', 'Ian', 'Wallace', 'Ken', 'Bob', 'Jaime', 'Casey', 'Alfredo', 'Alberto', 'Dave', 'Ivan', 'Johnnie', 'Sidney', 'Byron', 'Julian', 'Isaac', 'Morris', 'Clifton', 'Willard', 'Daryl', 'Ross', 'Virgil', 'Andy', 'Marshall', 'Salvador', 'Perry', 'Kirk', 'Sergio', 'Marion', 'Tracy', 'Seth', 'Kent', 'Terrance', 'Rene', 'Eduardo', 'Terrence', 'Enrique', 'Freddie', 'Wade'];
    surNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores', 'Morris', 'Nguyen', 'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Morales', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Gutierrez', 'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons', 'Patterson', 'Jordan', 'Reynolds', 'Hamilton', 'Graham', 'Kim', 'Gonzales', 'Alexander', 'Ramos', 'Wallace', 'Griffin', 'West', 'Cole', 'Hayes', 'Chavez', 'Gibson', 'Bryant', 'Ellis', 'Stevens', 'Murray', 'Ford', 'Marshall', 'Owens', 'Mcdonald', 'Harrison'];
    nameCount = maleNames.length;
    surnameCount = surNames.length;
    columns = {
      ID: 'auto',
      memberID: 'number random 1000',
      name: 'string function getName',
      dateDonated: 'date random 365',
      amount: 'number function getAmount'
    };
    transforms = {
      getName: function() {
        var idx, idx2;
        idx = Math.floor(Math.random() * nameCount);
        idx2 = Math.floor(Math.random() * surnameCount);
        return maleNames[idx] + ' ' + surNames[idx2];
      },
      getAmount: function() {
        var amount, donation;
        amount = Math.floor(Math.random() * 1000);
        donation = amount;
        if (amount % 100 === 0) {
          donation = amount * 50;
        }
        if (amount % 20 === 0) {
          donation = amount * 10;
        }
        return donation;
      }
    };
    dataGen = new (require("../utils/dataGen")).DataGen(columns, numRows, transforms);
    data = dataGen.generateData();
    console.log(data);
    return dataGen.saveData(url + 'DonorView', data, function(err, result) {
      if (callback != null) {
        return callback(err, result);
      }
    });
  };
  exports.saveDonors = function(numRows, url, callback) {
    var columns, data, dataGen, maleNames, nameCount, surNames, surnameCount, transforms;
    maleNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Charles', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Paul', 'Mark', 'Donald', 'George', 'Kenneth', 'Steven', 'Edward', 'Brian', 'Ronald', 'Anthony', 'Kevin', 'Jason', 'Matthew', 'Gary', 'Timothy', 'Jose', 'Larry', 'Jeffrey', 'Frank', 'Scott', 'Eric', 'Stephen', 'Andrew', 'Raymond', 'Gregory', 'Joshua', 'Jerry', 'Dennis', 'Walter', 'Patrick', 'Peter', 'Harold', 'Douglas', 'Henry', 'Carl', 'Arthur', 'Ryan', 'Roger', 'Joe', 'Juan', 'Jack', 'Albert', 'Jonathan', 'Justin', 'Terry', 'Gerald', 'Keith', 'Samuel', 'Willie', 'Ralph', 'Lawrence', 'Nicholas', 'Roy', 'Benjamin', 'Bruce', 'Brandon', 'Adam', 'Harry', 'Fred', 'Wayne', 'Billy', 'Steve', 'Louis', 'Jeremy', 'Aaron', 'Randy', 'Howard', 'Eugene', 'Carlos', 'Russell', 'Bobby', 'Victor', 'Martin', 'Ernest', 'Phillip', 'Todd', 'Jesse', 'Craig', 'Alan', 'Shawn', 'Clarence', 'Sean', 'Philip', 'Chris', 'Johnny', 'Earl', 'Jimmy', 'Antonio', 'Danny', 'Bryan', 'Tony', 'Luis', 'Mike', 'Stanley', 'Leonard', 'Nathan', 'Dale', 'Manuel', 'Rodney', 'Curtis', 'Norman', 'Allen', 'Marvin', 'Vincent', 'Glenn', 'Jeffery', 'Travis', 'Jeff', 'Chad', 'Jacob', 'Lee', 'Melvin', 'Alfred', 'Kyle', 'Francis', 'Bradley', 'Jesus', 'Herbert', 'Frederick', 'Ray', 'Joel', 'Edwin', 'Don', 'Eddie', 'Ricky', 'Troy', 'Randall', 'Barry', 'Alexander', 'Bernard', 'Mario', 'Leroy', 'Francisco', 'Marcus', 'Micheal', 'Theodore', 'Clifford', 'Miguel', 'Oscar', 'Jay', 'Jim', 'Tom', 'Calvin', 'Alex', 'Jon', 'Ronnie', 'Bill', 'Lloyd', 'Tommy', 'Leon', 'Derek', 'Warren', 'Darrell', 'Jerome', 'Floyd', 'Leo', 'Alvin', 'Tim', 'Wesley', 'Gordon', 'Dean', 'Greg', 'Jorge', 'Dustin', 'Pedro', 'Derrick', 'Dan', 'Lewis', 'Zachary', 'Corey', 'Herman', 'Maurice', 'Vernon', 'Roberto', 'Clyde', 'Glen', 'Hector', 'Shane', 'Ricardo', 'Sam', 'Rick', 'Lester', 'Brent', 'Ramon', 'Charlie', 'Tyler', 'Gilbert', 'Gene', 'Marc', 'Reginald', 'Ruben', 'Brett', 'Angel', 'Nathaniel', 'Rafael', 'Leslie', 'Edgar', 'Milton', 'Raul', 'Ben', 'Chester', 'Cecil', 'Duane', 'Franklin', 'Andre', 'Elmer', 'Brad', 'Gabriel', 'Ron', 'Mitchell', 'Roland', 'Arnold', 'Harvey', 'Jared', 'Adrian', 'Karl', 'Cory', 'Claude', 'Erik', 'Darryl', 'Jamie', 'Neil', 'Jessie', 'Christian', 'Javier', 'Fernando', 'Clinton', 'Ted', 'Mathew', 'Tyrone', 'Darren', 'Lonnie', 'Lance', 'Cody', 'Julio', 'Kelly', 'Kurt', 'Allan', 'Nelson', 'Guy', 'Clayton', 'Hugh', 'Max', 'Dwayne', 'Dwight', 'Armando', 'Felix', 'Jimmie', 'Everett', 'Jordan', 'Ian', 'Wallace', 'Ken', 'Bob', 'Jaime', 'Casey', 'Alfredo', 'Alberto', 'Dave', 'Ivan', 'Johnnie', 'Sidney', 'Byron', 'Julian', 'Isaac', 'Morris', 'Clifton', 'Willard', 'Daryl', 'Ross', 'Virgil', 'Andy', 'Marshall', 'Salvador', 'Perry', 'Kirk', 'Sergio', 'Marion', 'Tracy', 'Seth', 'Kent', 'Terrance', 'Rene', 'Eduardo', 'Terrence', 'Enrique', 'Freddie', 'Wade'];
    surNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores', 'Morris', 'Nguyen', 'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Morales', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Gutierrez', 'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons', 'Patterson', 'Jordan', 'Reynolds', 'Hamilton', 'Graham', 'Kim', 'Gonzales', 'Alexander', 'Ramos', 'Wallace', 'Griffin', 'West', 'Cole', 'Hayes', 'Chavez', 'Gibson', 'Bryant', 'Ellis', 'Stevens', 'Murray', 'Ford', 'Marshall', 'Owens', 'Mcdonald', 'Harrison'];
    nameCount = maleNames.length;
    surnameCount = surNames.length;
    columns = {
      ID: 'auto',
      name: 'string function getName',
      email: 'string function getEmail'
    };
    transforms = {
      getName: function() {
        var idx, idx2;
        idx = Math.floor(Math.random() * nameCount);
        idx2 = Math.floor(Math.random() * surnameCount);
        return maleNames[idx] + ' ' + surNames[idx2];
      },
      getEmail: function() {
        var idx, idx2;
        idx = Math.floor(Math.random() * nameCount);
        idx2 = Math.floor(Math.random() * surnameCount);
        return maleNames[idx] + '@' + surNames[idx2] + ".com";
      }
    };
    dataGen = new DataGen(columns, numRows, transforms);
    data = dataGen.generateData();
    return dataGen.saveData(url + 'Donors', data, function(err, result) {
      if (callback != null) {
        return callback(err, result);
      }
    });
  };
  exports.saveDonorsHistory = function(numRows, url, callback) {
    var columns, data, dataGen, transforms;
    columns = {
      ID: 'auto',
      donorID: 'number function getDonorID',
      dateDonated: 'date random 365',
      amount: 'number function getAmount'
    };
    transforms = {
      getDonorID: function() {
        var donorID;
        return donorID = Math.floor(Math.random() * numRows);
      },
      getAmount: function() {
        var amount, donation;
        amount = Math.floor(Math.random() * 1000);
        donation = amount;
        if (amount % 100 === 0) {
          donation = amount * 50;
        }
        if (amount % 20 === 0) {
          donation = amount * 10;
        }
        return donation;
      }
    };
    dataGen = new DataGen(columns, numRows, transforms);
    data = dataGen.generateData();
    return dataGen.saveData(url + 'DonorsHistory', data, function(err, result) {
      if (callback != null) {
        return callback(err, result);
      }
    });
  };
  exports.getDonorViewChart = function(url, callback) {
    var dataColl;
    dataColl = new DataColl(url + 'DonorView', {
      id: ' '
    });
    return dataColl.getAll(function(err, data) {
      var chartData, donationsArray, item, mult, num, obj, x, y, _i, _j, _len, _len2;
      donationsArray = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        obj = data[_i];
        donationsArray.push(obj.amount);
      }
      mult = 100;
      x = (function() {
        var _results;
        _results = [];
        for (num = 1; num <= 10; num++) {
          _results.push(num * mult);
        }
        return _results;
      })();
      y = (function() {
        var _results;
        _results = [];
        for (num = 1; num <= 10; num++) {
          _results.push(0);
        }
        return _results;
      })();
      for (_j = 0, _len2 = donationsArray.length; _j < _len2; _j++) {
        item = donationsArray[_j];
        for (num = 0; num <= 9; num++) {
          if ((num * mult < item && item <= (num + 1) * mult)) {
            y[num]++;
          }
        }
      }
      chartData = {
        x: x,
        y: y
      };
      return callback(err, chartData);
    });
  };
  exports.getCollDataAsCSV = function(collectionName, url, callback) {
    var dataColl;
    dataColl = new DataColl(url + collectionName, {
      id: ' '
    });
    return dataColl.getAll(function(err, data) {
      var str;
      str = convertToCSV(data);
      if (callback != null) {
        return callback(err, str);
      }
    });
  };
  convertToCSV = function(objArray) {
    var array, i, index, key, line, obj, str, value;
    array = (typeof objArray !== "object" ? JSON.parse(objArray) : objArray);
    str = "";
    i = 0;
    if (array.length > 0) {
      obj = array[0];
    }
    for (key in obj) {
      value = obj[key];
      str += key + ",";
    }
    str = str.slice(0, (str.length - 2 + 1) || 9e9) + "\r\n";
    while (i < array.length) {
      line = "";
      for (index in array[i]) {
        if (line !== "") {
          line += ",";
        }
        line += array[i][index];
      }
      str += line + "\r\n";
      i++;
    }
    return str;
  };
}).call(this);
