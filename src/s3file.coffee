knox = require 'knox'

client = knox.createClient
  key: 'AKIAIEF5PSDVAXWUIQWQ'
  secret: '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'
  bucket: 'agilesense'

exports.S3File = class S3File
  constructor: (@account, @fileName) ->
    @destinationFileName = @account + "/" + @fileName

  get: ->
    client.get(@destinationFileName).on("response", (res) ->
      res.setEncoding "utf8"
      res.on "data", (chunk) ->
        console.log chunk
    ).end()
  
  save: (path = null, callback)->
    fileName = @fileName
    fileName = path + '/' + @fileName
    client.putFile fileName, @destinationFileName, (err, res) ->
      if err then callback err, null else callback null, res

  delete: (callback)->
    client.deleteFile @destinationFileName, (err, res) ->
      if err then callback err, null else callback null, res
