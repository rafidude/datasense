(function() {
  var User, getUsers;
  User = (require('../lib/userModel')).User;
  getUsers = function() {
    var user1;
    user1 = {
      name: 'Test User',
      email: 'user1@test.com'
    };
    return [user1];
  };
  describe("Security, users retrieve/save", function() {
    return it("saves and retrieves users from the database given the email address", function() {
      var user, users;
      users = getUsers();
      user = new User(users[0].email);
      user.removeAll(function() {
        return user.save(users[0], function(err, result) {
          expect(err).toBe(null);
          expect(result).toBe(true);
          return user.get(function(err, result) {
            expect(result.email).toBe('user1@test.com');
            expect(result.name).toBe('Test User');
            return asyncSpecDone();
          });
        });
      });
      return asyncSpecWait();
    });
  });
}).call(this);
