'use strict';
const { QueryTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const userIdArray = await queryInterface.sequelize.query('select id from Users', { type: QueryTypes.SELECT })
    const albumIdArray = await queryInterface.sequelize.query('select id from Albums', { type: QueryTypes.SELECT })
    const data = []
    for (let i = 0; i < 10; ++i) {
      data.push({
        userId: userIdArray[Math.floor(Math.random() * userIdArray.length).toFixed(0)].id,
        albumId: albumIdArray[Math.floor(Math.random() * albumIdArray.length).toFixed(0)].id,
        title: `Song Title ${i}`,
        description: `Song Description ${i}`,
        url: `http://example.io/song/${i}`,
        imageUrl: `http://example.io/songImage/${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert('Songs', data)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Songs');
  }
};
