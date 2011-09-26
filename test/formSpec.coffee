Form = (require '../lib/formModel').Form
form = new Form 'role'

getFormDefinitions = ->
  formDef2 = {name: 'test', fields:[{field:'Tester', type:'text'}]}
  formDef1 =
    account: 'global'
    name: 'role'
    fields: [ 
              field: 'name'
              type: 'text'
              validations: required: 1
            , 
              field: 'permissions'
              type: 'text'
              validations: required: 1
            ]
  formDef3 = {name: 'item', account: 'global', formFields: "Name, Age, DonatedAmount, Gender"}
  [formDef1, formDef2, formDef3]

describe "Forms definition and their HTML output", ->
  it "saves the form definitions in the database", ->
    form.removeAll ->
      formDefs = getFormDefinitions()
      form.save formDefs[0], (err, result)->
        form.getAll (err, docs) ->
          expect(docs.length).toBe 1
          form.save formDefs[1], (err, result)->
            form.getAll (err, docs) ->
              expect(docs.length).toBe 2
              asyncSpecDone()
    asyncSpecWait()

  it "should not save a duplicate form with same account and name", ->
    form.removeAll ->
      formDefs = getFormDefinitions()
      form.save formDefs[0], (err, result)->
        form.getAll (err, docs) ->
          expect(docs.length).toBe 1
          formDefs = getFormDefinitions()
          form.save formDefs[0], (err, result)->
            expect(err).toNotBe null
            asyncSpecDone()
    asyncSpecWait()

  it "should save a duplicate form with same name but different account", ->
    form.removeAll ->
      formDefs = getFormDefinitions()
      form.save formDefs[0], (err, result)->
        form.getAll (err, docs) ->
          expect(docs.length).toBe 1
          formDefs = getFormDefinitions()
          formDefs[0].account = 'bmcm'
          form.save formDefs[0], (err, result)->
            expect(err).toBe null
            form.getAll (err, docs) ->
              expect(docs.length).toBe 2
              asyncSpecDone()
    asyncSpecWait()

  it "retrieves form definitions from the database given the uri of the form", ->
    form.removeAll ->
      formDefs = getFormDefinitions()
      form.save formDefs[0], (err, result)->
        expect(err).toBe null
        expect(result).toBe true
        form.get (err, result) ->
          expect(result.name).toBe 'role'
          asyncSpecDone()
    asyncSpecWait()
