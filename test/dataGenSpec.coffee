DataGen = (require "../lib/utils/dataGen").DataGen
DataColl = (require '../lib/models/commonModels').DataColl

columnsDef = 
  ID:'auto'
  memberID: 'number random 1000'
  name: 'string function getName'
  dateDonated: 'date random 365'
  Amount: 'number function getAmount'

maleNames = ['James','John']
surNames =['Smith','Johnson']

transforms =
  getName: ->
    idx = Math.floor(Math.random()*(maleNames.length))
    idx2 = Math.floor(Math.random()*(surNames.length))
    maleNames[idx] + ' ' + surNames[idx2]

  getAmount: ->
    amount = Math.floor(Math.random()*1000)
    donation = amount
    donation = amount*50 if amount%100 is 0
    donation = amount*10 if amount%20 is 0
    donation = 42
    donation

generateDonorData = ->
  dataGen = new DataGen columnsDef, 200, transforms
  data = dataGen.generateData()
  dataGen.saveData 'testColl', data, (err, result) ->
    1

describe "Data generation tests for Donors", ->
  it "should generate 3 rows of donor related data", ->
    dataGen = new DataGen columnsDef, 3, transforms
    data = dataGen.generateData()
    expect(data.length).toBe 3

  it "should generate auto increment IDs", ->
    dataGen = new DataGen columnsDef, 2, transforms
    data = dataGen.generateData()
    expect(data.length).toBe 2
    expect(data[0].ID).toBe 1
    expect(data[1].ID).toBe 2
    
  it "should generate random numbers", ->
    dataGen = new DataGen columnsDef, 2, transforms
    data = dataGen.generateData()
    expect(data.length).toBe 2
    expect(data[0].memberID).toBeGreaterThan 0
    expect(data[0].memberID).toBeLessThan 1001
    expect(data[1].memberID).toBeGreaterThan 0
    expect(data[1].memberID).toBeLessThan 1001
  
  it "should generate string names", ->
    dataGen = new DataGen columnsDef, 2, transforms
    data = dataGen.generateData()
    expect(data.length).toBe 2
    namesArr = data[0].name.split(' ')
    idx = maleNames.indexOf namesArr[0]
    expect(idx).toBeGreaterThan -1
    idx = surNames.indexOf namesArr[1]
    expect(idx).toBeGreaterThan -1

  it "should call user defined functions", ->
    dataGen = new DataGen columnsDef, 1, transforms
    data = dataGen.generateData()
    expect(data.length).toBe 1
    expect(data[0].Amount).toBe 42

  it "should save data to dataCollData collection", ->
    dataGen = new DataGen columnsDef, 3, transforms
    data = dataGen.generateData()
    dataGen.saveData 'testColl', data, (err, result) ->
      expect(err).toBe null
      dataCollData = new DataColl 'testColl', id: ' '
      dataCollData.getAll (err, docs) ->
        expect(docs.length).toBe 3
        expect(docs[0].ID).toBe 1
        expect(docs[2].ID).toBe 3
        asyncSpecDone()
    asyncSpecWait()

  # it "should generate donor data", ->
  #   generateDonorData()