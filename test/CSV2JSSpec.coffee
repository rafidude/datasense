CSV2JS = require '../lib/CSV2JS'

toJS = CSV2JS.csvToJs

describe "Convert a CSV string into JSON", ->
  it "requires a non-empty CSV content", ->
    a = toJS ""
    expect(a.error).toBe true
    expect(a.message).toBe 'CSV text must be valid.'
    
  it "requires at least 2 rows one being header and the other a data row", ->
    a = toJS "Name, Age"
    expect(a.error).toBe true
    expect(a.message).toBe 'The CSV text MUST have a header row!'

  it "parses a single row of CSV data", ->
    a = toJS "Name, Age \n AgileSense, 1"
    expect(a.error).toBe false
    expect(a.data).toNotBe null
    expect(a.data[0].Name).toBe "AgileSense"
    expect(a.data[0].Age).toBe "1"

  it "parses a two rows of CSV data", ->
    a = toJS "Name, Age \n AgileSense, 1\n ElementSign, 6"
    expect(a.error).toBe false
    expect(a.data.length).toBe 2
    expect(a.data[1].Name).toBe "ElementSign"
    expect(a.data[1].Age).toBe "6"

