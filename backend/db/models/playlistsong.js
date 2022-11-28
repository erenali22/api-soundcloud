"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlaylistSong extends Model {
    static associate(models) {
      PlaylistSong.belongsTo(models.Song, {
        foreignKey: "songId",
      });
      PlaylistSong.belongsTo(models.Playlist, {
        foreignKey: "playlistId",
      });
    }
  }
  PlaylistSong.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PlaylistSong",
    },
  );
  return PlaylistSong;
};
