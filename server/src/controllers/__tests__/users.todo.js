import {initDb, generate} from 'til-server-test-utils'
import * as usersController from '../users.todo'
import { omit } from 'lodash'
import db from '../../utils/db'

const safeUser = (u) => omit(u, ['salt', 'hash'])
function setup() {
  const req = {
    body: {},
  }
  const res = {}
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this
      }.bind(res),
    ),
    json: jest.fn(
      function json() {
        return this
      }.bind(res),
    ),
    send: jest.fn(
      function send() {
        return this
      }.bind(res),
    ),
  })
  return {
    req,
    res
  }
}
beforeEach(() => initDb())

test('getUsers returns all users in database', async () => {
  const {req, res} = setup()
  await usersController.getUsers(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const { users } = firstArg
  expect(users.length).toBeGreaterThan(0)
  const actualUsers = await db.getUsers()
  expect(users).toEqual(actualUsers.map(u => safeUser(u)))
})


test('getUser returns the specific user', async () => {
  const testUser = await db.insertUser(generate.userData())
  const {req, res} = setup()
  req.params= {
      id: testUser.id
    }

  await usersController.getUser(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const {
    user
  } = firstArg
  expect(user).toEqual(safeUser(testUser))
  const userFromDb = await db.getUser(user.id)
  expect(userFromDb).toEqual(testUser)
})

test('updateUser updates the user with the given changes', async () => {
  const testUser = await db.insertUser(generate.userData())
  const username = generate.username()
  const {req, res} = setup()

    req.user= {
      id: testUser.id
    },
    req.params = {
      id: testUser.id
    },
    req.body ={
      username
    }
  const updatedUser = {
    ...testUser,
    username
  }

  await usersController.updateUser(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const {
    user
  } = firstArg
  expect(user).toEqual(safeUser(updatedUser))
  const userFromDb = await db.getUser(user.id)
  expect(userFromDb).toEqual(updatedUser)
})


test('deleteUser will 403 if not requested by the user',async () => {
  const {req, res} = setup()
  const testUser = await db.insertUser(generate.userData())
  req.params = {id: testUser.id}
  req.user = {id: generate.id()}
  await usersController.deleteUser(req, res)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.send).toHaveBeenCalledTimes(1)
})

test('deleteUser will 404 if user does not exist', async () => {
  const {req, res} = setup()
  req.params = {id: generate.id()}
  req.user = {id: generate.id()}
  await usersController.deleteUser(req, res)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.send).toHaveBeenCalledTimes(1)
})

test('deleteUser will delete the user if properly requested',async () => {
  const {req, res} = setup()
  const testUser = await db.insertUser(generate.userData())
  req.params = {id: testUser.id}
  req.user = {id: testUser.id}
  await usersController.deleteUser(req, res)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(204)
  expect(res.send).toHaveBeenCalledTimes(1)
  const userFromDb = await db.getUser(testUser.id)
  expect(userFromDb).toEqual(undefined)
})
//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=Testing&e=users%20test$20object%20factories&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
