'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const data = []
    for (let i = 0; i < 10; ++i) {
      data.push({
        username: `FakeUser${i}`,
        firstName: 'FirstName${i}',
        lastName: 'LastName${i}',
        email: `demo${i}@user.io`,
        hashedPassword: bcrypt.hashSync('password'),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert('Users', data)
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Users');
  }
};
