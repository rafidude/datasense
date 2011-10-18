Model = (require "./model").Model

exports.User = class User extends Model
  collectionName = 'users'
  constructor: (email) ->
    super collectionName, email: email

exports.Form = class Form extends Model
  collectionName = 'formDefs'
  constructor: (formName, account='global') ->
    super collectionName, name: formName, account: account

exports.FileUpload = class FileUpload extends Model
  collectionName = 'fileUploads'
  constructor: (id = ' ') ->
    super collectionName, _id: id

exports.DataColl = class DataColl extends Model
