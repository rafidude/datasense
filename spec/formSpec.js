(function() {
  var Form, form, getFormDefinitions;
  Form = (require('../lib/commonModels')).Form;
  form = new Form('role');
  getFormDefinitions = function() {
    var formDef1, formDef2, formDef3;
    formDef2 = {
      name: 'test',
      fields: [
        {
          field: 'Tester',
          type: 'text'
        }
      ]
    };
    formDef1 = {
      account: 'global',
      name: 'role',
      fields: [
        {
          field: 'name',
          type: 'text',
          validations: {
            required: 1
          }
        }, {
          field: 'permissions',
          type: 'text',
          validations: {
            required: 1
          }
        }
      ]
    };
    formDef3 = {
      name: 'item',
      account: 'global',
      formFields: "Name, Age, DonatedAmount, Gender"
    };
    return [formDef1, formDef2, formDef3];
  };
  describe("Forms definition and their HTML output", function() {
    it("saves the form definitions in the database", function() {
      form.removeAll(function() {
        var formDefs;
        formDefs = getFormDefinitions();
        return form.save(formDefs[0], function(err, result) {
          return form.getAll(function(err, docs) {
            expect(docs.length).toBe(1);
            return form.save(formDefs[1], function(err, result) {
              return form.getAll(function(err, docs) {
                expect(docs.length).toBe(2);
                return asyncSpecDone();
              });
            });
          });
        });
      });
      return asyncSpecWait();
    });
    it("should not save a duplicate form with same account and name", function() {
      form.removeAll(function() {
        var formDefs;
        formDefs = getFormDefinitions();
        return form.save(formDefs[0], function(err, result) {
          return form.getAll(function(err, docs) {
            expect(docs.length).toBe(1);
            formDefs = getFormDefinitions();
            return form.save(formDefs[0], function(err, result) {
              expect(err).toNotBe(null);
              return asyncSpecDone();
            });
          });
        });
      });
      return asyncSpecWait();
    });
    it("should save a duplicate form with same name but different account", function() {
      form.removeAll(function() {
        var formDefs;
        formDefs = getFormDefinitions();
        return form.save(formDefs[0], function(err, result) {
          return form.getAll(function(err, docs) {
            expect(docs.length).toBe(1);
            formDefs = getFormDefinitions();
            formDefs[0].account = 'bmcm';
            return form.save(formDefs[0], function(err, result) {
              expect(err).toBe(null);
              return form.getAll(function(err, docs) {
                expect(docs.length).toBe(2);
                return asyncSpecDone();
              });
            });
          });
        });
      });
      return asyncSpecWait();
    });
    return it("retrieves form definitions from the database given the uri of the form", function() {
      form.removeAll(function() {
        var formDefs;
        formDefs = getFormDefinitions();
        return form.save(formDefs[0], function(err, result) {
          expect(err).toBe(null);
          expect(result).toBe(true);
          return form.get(function(err, result) {
            expect(result.name).toBe('role');
            return asyncSpecDone();
          });
        });
      });
      return asyncSpecWait();
    });
  });
}).call(this);
