const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    database: 'Assets-Management',
    host: 'localhost',
    port: 5432,
    password: '1234'
});

client.connect().then(res => {
    console.log('PostgreSQL connected');
}).catch(err => {
    console.log('Error while connecting to Database', err);
});

module.exports = client;