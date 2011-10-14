S3File = (require '../lib/utils/s3file').S3File

fileName = 'test.csv'
account = 'global'

describe "Amazon S3 file save, get and delete", ->
  it "delete a file from Amazon S3", ->
    s3 = new S3File account, fileName
    s3.delete (err, res) ->
      expect(err).toBe null
      expect(res).toNotBe null
      asyncSpecDone()
    asyncSpecWait()

  it "saves a local file to Amazon S3", ->
    s3 = new S3File account, fileName
    path = process.cwd() + '/test'
    s3.save path, (err, res) ->
      expect(err).toBe null
      expect(res).toNotBe null
      asyncSpecDone()
    asyncSpecWait()

  it "gets a file from Amazon S3", ->
    s3 = new S3File account, fileName
    s3.get (err, res) ->
      expect(res).toContain('AgileSense')
      asyncSpecDone()
    asyncSpecWait()

