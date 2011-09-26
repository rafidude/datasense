(function() {
  var Form, Model, collectionName;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  collectionName = 'formDefs';
  Model = (require("./model")).Model;
  exports.Form = Form = (function() {
    __extends(Form, Model);
    function Form(formName, account) {
      if (account == null) {
        account = 'global';
      }
      Form.__super__.constructor.call(this, collectionName, {
        name: formName,
        account: account
      });
    }
    return Form;
  })();
}).call(this);
