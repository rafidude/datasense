FileUpload = (require '../models/commonModels').FileUpload
fileUpload = new FileUpload
utils = (require '../utils/dutils')

module.exports = (app) ->
  app.get "/:url/upload", (req, res) ->
    url = req.params.url
    doneUrl = "http://#{req.headers.host}/#{url}/done"
    [encodedParams, paramsStr, hash] = utils.getUploadParams(doneUrl)
    res.render 'upload', encodedParams: encodedParams, hash: hash

  app.get "/:url/done", (req, res) ->
    data = req.query
    data.account = req.params.url
    fileUpload.save data, (err, success) ->
      res.end JSON.stringify(data)

  setInterval ->
      fileUpload.getAll (err, docs) ->
        console.log docs if not err and docs.length > 0
        for doc in docs
          utils.parseFile(doc.account, doc.assembly_url)
    , 5000

