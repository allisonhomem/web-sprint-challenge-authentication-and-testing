const users = [
    {
        id: 1,
        username: 'ScubaSteve',
        password: '1234'
    }
]

exports.users = users;

exports.seed = async function (knex) {
    await knex('users').truncate()
    await knex('users').insert(users)
}