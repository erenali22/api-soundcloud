'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      Album.hasMany(models.Song, { foreignKey: "albumId", as: "Songs" , onDelete: 'CASCADE', hooks: true })
      Album.belongsTo(models.User, { foreignKey: "userId", as: "Artist" })
    }
  }
  Album.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Album',
  });

  return Album;
};
