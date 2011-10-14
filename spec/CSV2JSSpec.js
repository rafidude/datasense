(function() {
  var CSV2JS, toJS;
  CSV2JS = require('../lib/utils/CSV2JS');
  toJS = CSV2JS.csvToJs;
  describe("Convert a CSV string into JSON", function() {
    it("requires a non-empty CSV content", function() {
      var a;
      a = toJS("");
      expect(a.error).toBe(true);
      return expect(a.message).toBe('CSV text must be valid.');
    });
    it("requires at least 2 rows one being header and the other a data row", function() {
      var a;
      a = toJS("Name, Age");
      expect(a.error).toBe(true);
      return expect(a.message).toBe('The CSV text MUST have a header row!');
    });
    it("parses a single row of CSV data", function() {
      var a;
      a = toJS("Name, Age \n AgileSense, 1");
      expect(a.error).toBe(false);
      expect(a.data).toNotBe(null);
      expect(a.data[0].Name).toBe("AgileSense");
      return expect(a.data[0].Age).toBe("1");
    });
    return it("parses a two rows of CSV data", function() {
      var a;
      a = toJS("Name, Age \n AgileSense, 1\n ElementSign, 6");
      expect(a.error).toBe(false);
      expect(a.data.length).toBe(2);
      expect(a.data[1].Name).toBe("ElementSign");
      return expect(a.data[1].Age).toBe("6");
    });
  });
}).call(this);
