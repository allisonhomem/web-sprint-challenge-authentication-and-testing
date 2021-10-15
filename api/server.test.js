const request = require('supertest')
const server = require('./server.js')
const db = require('../data/dbConfig.js')
const jokes = require('./jokes/jokes-data.js')


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})


test('sanity', () => {
  expect(true).not.toBe(false)
})

describe('[GET] /api/jokes', () => {
  test('[1] user with valid token receives jokes', async () => {
    await request(server).post('/api/auth/register').send({username: "ScubaSteve", password: "1234"})
    let res = await request(server).post('/api/auth/login').send({username: "ScubaSteve", password: "1234"})
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body).toEqual(jokes)
  })
  test('[2] user with invalid or missing token receives error message', async () => {
    let res = await request(server).get('/api/jokes')
    expect(res.body.message).toBe("token required")

    res = await request(server).get('/api/jokes').set('Authorization', 'bad token')
    expect(res.body.message).toBe("token invalid")
  })
  test('[3] user with invalid or missing token cannot see jokes', async () => {
    let res = await request(server).get('/api/jokes')
    expect(res.body).not.toEqual(jokes)
  })
})

describe('[POST] /api/auth/register', () => {
  test('[4] valid credentials creates new user in database', async () => {
    await request(server).post('/api/auth/register').send({username: "AbstractAllie", password: "1234"})
    let res = await db('users').where('username', "AbstractAllie").first()
    expect(res).toBeTruthy()
  })
  test('[5] missing credentials receives error', async () => {
    let res = await request(server).post('/api/auth/register').send({username: null, password: "farts"})
    expect(res.body.message).toBe("username and password required")

    res = await request(server).post('/api/auth/register').send({username: "FranticFibonacci", password: null})
    expect(res.body.message).toBe("username and password required")
  })
  test('[6] error message sent for non-unique username', async () => {
    await request(server).post('/api/auth/register').send({username: "hobbyhypatia", password: "1234"})
    let res = await request(server).post('/api/auth/register').send({username: "hobbyhypatia", password: "1234"})
    expect(res.body.message).toBe("username taken")
  })
})

describe('[POST] /api/auth/login', () => {
  test('[7] missing credentials receives error', async () => {
    await request(server).post('/api/auth/register').send({username: "FranticFibonacci", password: "carrots"})
    let res = await request(server).post('/api/auth/register').send({username: null, password: "carrots"})
    expect(res.body.message).toBe("username and password required")

    await request(server).post('/api/auth/register').send({username: "FranticFibonacci", password: "carrots"})
    res = await request(server).post('/api/auth/register').send({username: "FranticFibonacci", password: null})
    expect(res.body.message).toBe("username and password required")
  })
  test('[8] invalid username receives an error', async () => {
    await request(server).post('/api/auth/register').send({username: "FranticFibonacci", password: "carrots"})
    let res = await request(server).post('/api/auth/login').send({username: "Fibonacci", password: "carrots"})
    expect(res.body.message).toBe("invalid credentials")
  })
})
