'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlaylistSong extends Model {
    static associate(models) {
    }
  }
  PlaylistSong.init({
    order: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PlaylistSong',
  });
  return PlaylistSong;
};