(function() {
  var Model, User, collectionName;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  collectionName = 'users';
  Model = (require("./model")).Model;
  exports.User = User = (function() {
    __extends(User, Model);
    function User(email) {
      User.__super__.constructor.call(this, collectionName, {
        email: email
      });
    }
    return User;
  })();
}).call(this);
