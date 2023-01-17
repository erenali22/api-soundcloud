'use strict';
const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // const userIdArray = await queryInterface.sequelize.query('select id from Users', { type: QueryTypes.SELECT })
    const data = []
    for (let i = 1; i < 9; ++i) {
      data.push({
        userId: i,
        title: `Album Title${i}`,
        description: `Album description ${i}`,
        imageUrl: `https://picsum.photos/300`,
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
