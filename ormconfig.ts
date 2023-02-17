const { DataSource } = require("typeorm");

require('dotenv').config();
for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

const connectionSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity.js"],
    migrations: [
        "./migrations/*.ts"
    ],
    ssl: process.env.DB_SSL_CONNECTION === "true" ? true : false,
});

module.exports = {
    connectionSource
}
