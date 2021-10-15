const request = require('supertest')
const server = require('./server.js')
const db = require('../data/dbConfig.js')


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
//
afterAll(async () => {
  await db.destroy()
})


test('sanity', () => {
  expect(true).not.toBe(false)
})

describe('[GET] /api/jokes', () => {
  test.todo('[1]')
  test.todo('[2]')
})

describe('[POST] /api/auth/register', () => {
  test.todo('[3]')
  test.todo('[4]')
  test.todo('[5]')
})

describe('[POST] /api/auth/login', () => {
  test.todo('[6]')
  test.todo('[7]')
  test.todo('[8]')
})
