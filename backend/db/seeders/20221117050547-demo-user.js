'use strict';
const bcrypt = require("bcryptjs");



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
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
    await queryInterface.bulkInsert('Users', data)
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Users');
  }
};
