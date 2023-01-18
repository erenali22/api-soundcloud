'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    options.tableName = 'Users'
    const data = []
    for (let i = 0; i < 10; ++i) {
      data.push({
        username: `FakeUser${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `demo${i}@user.io`,
        hashedPassword: bcrypt.hashSync('password'),
      })
    }
    await queryInterface.bulkInsert(options, data)
  },

  async down (queryInterface) {
    options.tableName = 'Users'
    await queryInterface.bulkDelete(options);
  }
};
