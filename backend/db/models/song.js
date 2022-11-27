'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.belongsToMany(models.Playlist, { through: models.PlaylistSong, as: "Songs", foreignKey: "songId" })
      Song.hasMany(models.Comment, { foreignKey: "songId" })
    }
  }
  Song.init({
    userId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    url: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Song',
  });


  return Song;
};