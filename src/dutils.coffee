crypto = require 'crypto'
sanitize = require("validator").sanitize

auth_key = '1580cee65f904f7399ca08a1a844cfab'
auth_secret = '61b3703ab1a24f1b8be97b73dc2b33c50a2260a0'
template_id = 'b902f75dba8a4fadb054ab068e705b97'

getUploadParams = ->
  params = 
    auth:
      expires: "2011/10/01 16:53:14+00:00"
      key: auth_key
    template_id: template_id
    redirect_url: "http://localhost:3000/done"
    notify_url: "http://localhost:3000/filesready"

  paramsStr = JSON.stringify(params)
  encodedParams = sanitize(paramsStr).entityEncode()
  hash = crypto.createHmac("sha1", auth_secret).update(paramsStr).digest("hex")
  console.log [encodedParams, paramsStr, hash]
  [encodedParams, paramsStr, hash]

# getUploadParams()
S3File = (require '../lib/s3file').S3File
CSV2JS = require '../lib/CSV2JS'
toJS = CSV2JS.csvToJs
ParsedData = (require '../lib/commonModels').ParsedData
parsedData = new ParsedData
request = require("request")
FileUpload = (require '../lib/commonModels').FileUpload
fileUpload = new FileUpload

exports.parseFile = parseFile = (url) ->
  # if the status is complete, get the amazon file, parse the file, store results in mongoDB
  console.log url
  request url, (error, response, body) =>
    if not error and response.statusCode == 200
      result = JSON.parse(body)
      s3url = result.results[':original'][0].url
      arrurl = s3url.split('/')
      account = arrurl[3]
      fileName = '/' + arrurl[4] + '/' + arrurl[5]
      s3 = new S3File account, fileName
      s3.get (err, res) =>
        if err
          console.log err
        else 
          parsedRet = toJS res
          parsedData.save parsedRet.data, (err, success) =>
            console.log "Saved data after parsing the file uploaded: #{url}"
            fileUpload.remove {assembly_url: url}, (err, success) ->
              if err then console.log err else console.log "removed row"

