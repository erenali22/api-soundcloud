'use strict';
const { QueryTypes } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // const userIdArray = await queryInterface.sequelize.query('select id from Users', { type: QueryTypes.SELECT })
    options.tableName = 'Albums';
    const data = []
    for (let i = 1; i < 9; ++i) {
      data.push({
        userId: i,
        title: `Album${i}`,
        description: `Album description ${i}`,
        imageUrl: `https://picsum.photos/300`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    await queryInterface.bulkInsert(options, data)
  },

  async down(queryInterface) {
    options.tableName = 'Albums';
    await queryInterface.bulkDelete(options)
  }
};
