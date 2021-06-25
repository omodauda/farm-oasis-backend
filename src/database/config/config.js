require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DB,
    dialect: "postgres",
    logging: false
  }
}
