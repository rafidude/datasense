User = (require '../lib/models/commonModels').User
FileUpload = (require '../lib/models/commonModels').FileUpload

getUsers = ->
  user1 = name: 'Test User', email: 'user1@test.com', password: 'test', url: 'test'
  [user1]

getFileUploads = ->
  fileUpload1 = assembly_id: 'Fake ID', assembly_url: 'http://fake.url', _id: '1'
  fileUpload2 = assembly_id: 'Fake ID2', assembly_url: 'http://fake2.url', _id: ' '
  [fileUpload1, fileUpload2]

describe "Security, users retrieve/save", ->
  it "saves and retrieves users from the database given the email address", ->
    users = getUsers()
    user = new User users[0].email
    user.removeAll ->
      user.save users[0], (err, result)->
        expect(err).toBe null
        expect(result).toBe true
        user.get (err, result) ->
          expect(result.email).toBe 'user1@test.com'
          expect(result.name).toBe 'Test User'
          expect(result.url).toBe 'test'
          asyncSpecDone()
    asyncSpecWait()

describe "FileUpload information transloadit to Amazon S3", ->
  it "saves and retrieves fileuploads from the database given the id", ->
    fileUploads = getFileUploads()
    fileUpload = new FileUpload fileUploads[0]._id
    fileUpload.removeAll ->
      fileUpload.save fileUploads[0], (err, result)->
        expect(err).toBe null
        expect(result).toBe true
        fileUpload.get (err, result) ->
          expect(result.assembly_id).toBe 'Fake ID'
          expect(result.assembly_url).toBe 'http://fake.url'
          asyncSpecDone()
    asyncSpecWait()

  it "saves and retrieves fileuploads from the database given no arguments", ->
    fileUploads = getFileUploads()
    fileUpload = new FileUpload
    fileUpload.removeAll ->
      fileUpload.save fileUploads[1], (err, result)->
        expect(err).toBe null
        expect(result).toBe true
        fileUpload.getAll (err, docs) ->
          expect(docs[0].assembly_id).toBe 'Fake ID2'
          expect(docs[0].assembly_url).toBe 'http://fake2.url'
          asyncSpecDone()
    asyncSpecWait()
