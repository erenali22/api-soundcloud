'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      this.hasMany(models.Song, { foreignKey: "albumId", as: "Songs" })
      this.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: "Artist" })
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