(function() {
  var FileUpload, User, getFileUploads, getUsers;
  User = (require('../lib/commonModels')).User;
  FileUpload = (require('../lib/commonModels')).FileUpload;
  getUsers = function() {
    var user1;
    user1 = {
      name: 'Test User',
      email: 'user1@test.com',
      password: 'test',
      url: 'test'
    };
    return [user1];
  };
  getFileUploads = function() {
    var fileUpload1, fileUpload2;
    fileUpload1 = {
      assembly_id: 'Fake ID',
      assembly_url: 'http://fake.url',
      _id: '1'
    };
    fileUpload2 = {
      assembly_id: 'Fake ID2',
      assembly_url: 'http://fake2.url',
      _id: ' '
    };
    return [fileUpload1, fileUpload2];
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
            expect(result.url).toBe('test');
            return asyncSpecDone();
          });
        });
      });
      return asyncSpecWait();
    });
  });
  describe("FileUpload information transloadit to Amazon S3", function() {
    it("saves and retrieves fileuploads from the database given the id", function() {
      var fileUpload, fileUploads;
      fileUploads = getFileUploads();
      fileUpload = new FileUpload(fileUploads[0]._id);
      fileUpload.removeAll(function() {
        return fileUpload.save(fileUploads[0], function(err, result) {
          expect(err).toBe(null);
          expect(result).toBe(true);
          return fileUpload.get(function(err, result) {
            expect(result.assembly_id).toBe('Fake ID');
            expect(result.assembly_url).toBe('http://fake.url');
            return asyncSpecDone();
          });
        });
      });
      return asyncSpecWait();
    });
    return it("saves and retrieves fileuploads from the database given no arguments", function() {
      var fileUpload, fileUploads;
      fileUploads = getFileUploads();
      fileUpload = new FileUpload;
      fileUpload.removeAll(function() {
        return fileUpload.save(fileUploads[1], function(err, result) {
          expect(err).toBe(null);
          expect(result).toBe(true);
          return fileUpload.getAll(function(err, docs) {
            expect(docs[0].assembly_id).toBe('Fake ID2');
            expect(docs[0].assembly_url).toBe('http://fake2.url');
            return asyncSpecDone();
          });
        });
      });
      return asyncSpecWait();
    });
  });
}).call(this);
