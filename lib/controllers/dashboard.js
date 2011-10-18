(function() {
  var ParsedData, utils;
  ParsedData = (require('../models/commonModels')).ParsedData;
  utils = require('../utils/dutils');
  module.exports = function(app) {
    var requiresLogin;
    requiresLogin = function(req, res, next) {
      console.log(req.params.url);
      if (req.session.url) {
        return next();
      } else {
        return res.redirect('/login?redir=' + req.url);
      }
    };
    app.get("/:url/generatedata/:rows?", requiresLogin, function(req, res) {
      var columns, data, dataGen, maleNames, nameCount, rows, surNames, surnameCount, transforms, url;
      rows = req.params.rows;
      url = req.params.url;
      if (!(rows != null) && isNaN(parseInt(rows))) {
        rows = 100;
      } else {
        rows = parseInt(rows);
      }
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
      console.log(rows);
      dataGen = new (require("../utils/dataGen")).DataGen(columns, rows, transforms);
      data = dataGen.generateData();
      return dataGen.saveData(data, function(err, result) {
        return res.redirect("/" + url + "/charts");
      });
    });
    app.get("/:url/charts", requiresLogin, function(req, res) {
      var parsedData;
      parsedData = new ParsedData;
      return parsedData.getAll(function(err, data) {
        var curr_date, curr_month, curr_year, d, obj, pctPos, top, totalRows, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          obj = data[_i];
          d = new Date(obj.dateDonated);
          curr_date = d.getDate();
          curr_month = d.getMonth();
          curr_month++;
          curr_year = d.getFullYear();
          obj.date = curr_month + "/" + curr_date + "/" + curr_year;
        }
        top = req.query.top;
        if (top != null) {
          pctPos = -1;
          totalRows = data.length;
          pctPos = top.indexOf("p");
          if (pctPos > -1) {
            top = top.slice(0, pctPos);
            if (isNaN(parseInt(top))) {
              top = -1;
            }
            if (top >= 0 && top <= 100) {
              top = Math.ceil(totalRows * top / 100);
            } else {
              top = -1;
            }
          } else {
            if (isNaN(parseInt(top))) {
              top = -1;
            } else {
              top = parseInt(top);
            }
          }
          if (top !== -1) {
            utils.descBy(data, "amount");
            data.splice(top);
          }
        }
        if (top === -1) {
          top = null;
        }
        return res.render("table", {
          data: data,
          top: top
        });
      });
    });
    return app.get("/:url/donations", requiresLogin, function(req, res) {
      var parsedData;
      parsedData = new ParsedData;
      return parsedData.getAll(function(err, data) {
        var chartData, donationsArray, item, msgs_json, mult, num, obj, x, y, _i, _j, _len, _len2;
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
        msgs_json = JSON.stringify(chartData);
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        return res.end(msgs_json);
      });
    });
  };
}).call(this);
