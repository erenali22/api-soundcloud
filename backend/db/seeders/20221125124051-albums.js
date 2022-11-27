'use strict';
const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // const userIdArray = await queryInterface.sequelize.query('select id from Users', { type: QueryTypes.SELECT })
    const data = []
    for (let i = 0; i < 10; ++i) {
      data.push({
        userId: i,
        title: `Album Title${i}`,
        description: `Album description ${i}`,
        imageUrl: `http://example.io/album/${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert('Albums', data)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Albums')
  }
};
