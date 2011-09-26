collectionName = 'formDefs'
Model = (require "./model").Model

exports.Form = class Form extends Model
  constructor: (formName, account='global') ->
    super collectionName, name: formName, account: account
