collectionName = 'users'
Model = (require "./model").Model

exports.User = class User extends Model
  constructor: (email) ->
    super collectionName, email: email