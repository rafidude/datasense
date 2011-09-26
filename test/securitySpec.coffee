User = (require '../lib/userModel').User

getUsers = ->
  user1 = name: 'Test User', email: 'user1@test.com'
  [user1]

describe "Security, users retrieve/save", ->
  it "saves and retrieves users from the database given the email address", ->
    users = getUsers()
    user = new User users[0].email
    user.removeAll ->
      user.save users[0], (err, result)->
        expect(err).toBe null
        expect(result).toBe true
        user.get (err, result) ->
          expect(result.email).toBe 'user1@test.com'
          expect(result.name).toBe 'Test User'
          asyncSpecDone()
    asyncSpecWait()
