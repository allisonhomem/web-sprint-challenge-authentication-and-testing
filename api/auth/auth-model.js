const db = require('../../data/dbConfig.js')

function findById(id) {
    return db('users').where('id', id).first();
}

function findBy(filter) {
    return db('users').where(filter);
}

async function addUser(newUser) {
    const [id] = await db('users').insert(newUser);
    return findById(id);
}

module.exports = {
    findById,
    findBy,
    addUser
}