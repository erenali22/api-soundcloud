"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      Playlist.belongsToMany(models.Song, {
        through: models.PlaylistSong,
        foreignKey: "playlistId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Playlist.hasMany(models.PlaylistSong, {
        foreignKey: "playlistId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Playlist.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Playlist",
    },
  );
  return Playlist;
};
