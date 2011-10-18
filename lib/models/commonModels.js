(function() {
  var DataColl, FileUpload, Form, Model, User;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Model = (require("./model")).Model;
  exports.User = User = (function() {
    var collectionName;
    __extends(User, Model);
    collectionName = 'users';
    function User(email) {
      User.__super__.constructor.call(this, collectionName, {
        email: email
      });
    }
    return User;
  })();
  exports.Form = Form = (function() {
    var collectionName;
    __extends(Form, Model);
    collectionName = 'formDefs';
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
  exports.FileUpload = FileUpload = (function() {
    var collectionName;
    __extends(FileUpload, Model);
    collectionName = 'fileUploads';
    function FileUpload(id) {
      if (id == null) {
        id = ' ';
      }
      FileUpload.__super__.constructor.call(this, collectionName, {
        _id: id
      });
    }
    return FileUpload;
  })();
  exports.DataColl = DataColl = (function() {
    __extends(DataColl, Model);
    function DataColl() {
      DataColl.__super__.constructor.apply(this, arguments);
    }
    return DataColl;
  })();
}).call(this);
