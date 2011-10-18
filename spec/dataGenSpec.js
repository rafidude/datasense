(function() {
  var DataColl, DataGen, columnsDef, generateDonorData, maleNames, surNames, transforms;
  DataGen = (require("../lib/utils/dataGen")).DataGen;
  DataColl = (require('../lib/models/commonModels')).DataColl;
  columnsDef = {
    ID: 'auto',
    memberID: 'number random 1000',
    name: 'string function getName',
    dateDonated: 'date random 365',
    Amount: 'number function getAmount'
  };
  maleNames = ['James', 'John'];
  surNames = ['Smith', 'Johnson'];
  transforms = {
    getName: function() {
      var idx, idx2;
      idx = Math.floor(Math.random() * maleNames.length);
      idx2 = Math.floor(Math.random() * surNames.length);
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
      donation = 42;
      return donation;
    }
  };
  generateDonorData = function() {
    var data, dataGen;
    dataGen = new DataGen(columnsDef, 200, transforms);
    data = dataGen.generateData();
    return dataGen.saveData('testColl', data, function(err, result) {
      return 1;
    });
  };
  describe("Data generation tests for Donors", function() {
    it("should generate 3 rows of donor related data", function() {
      var data, dataGen;
      dataGen = new DataGen(columnsDef, 3, transforms);
      data = dataGen.generateData();
      return expect(data.length).toBe(3);
    });
    it("should generate auto increment IDs", function() {
      var data, dataGen;
      dataGen = new DataGen(columnsDef, 2, transforms);
      data = dataGen.generateData();
      expect(data.length).toBe(2);
      expect(data[0].ID).toBe(1);
      return expect(data[1].ID).toBe(2);
    });
    it("should generate random numbers", function() {
      var data, dataGen;
      dataGen = new DataGen(columnsDef, 2, transforms);
      data = dataGen.generateData();
      expect(data.length).toBe(2);
      expect(data[0].memberID).toBeGreaterThan(0);
      expect(data[0].memberID).toBeLessThan(1001);
      expect(data[1].memberID).toBeGreaterThan(0);
      return expect(data[1].memberID).toBeLessThan(1001);
    });
    it("should generate string names", function() {
      var data, dataGen, idx, namesArr;
      dataGen = new DataGen(columnsDef, 2, transforms);
      data = dataGen.generateData();
      expect(data.length).toBe(2);
      namesArr = data[0].name.split(' ');
      idx = maleNames.indexOf(namesArr[0]);
      expect(idx).toBeGreaterThan(-1);
      idx = surNames.indexOf(namesArr[1]);
      return expect(idx).toBeGreaterThan(-1);
    });
    it("should call user defined functions", function() {
      var data, dataGen;
      dataGen = new DataGen(columnsDef, 1, transforms);
      data = dataGen.generateData();
      expect(data.length).toBe(1);
      return expect(data[0].Amount).toBe(42);
    });
    return it("should save data to dataCollData collection", function() {
      var data, dataGen;
      dataGen = new DataGen(columnsDef, 3, transforms);
      data = dataGen.generateData();
      dataGen.saveData('testColl', data, function(err, result) {
        var dataCollData;
        expect(err).toBe(null);
        dataCollData = new DataColl('testColl', {
          id: ' '
        });
        return dataCollData.getAll(function(err, docs) {
          expect(docs.length).toBe(3);
          expect(docs[0].ID).toBe(1);
          expect(docs[2].ID).toBe(3);
          return asyncSpecDone();
        });
      });
      return asyncSpecWait();
    });
  });
}).call(this);
