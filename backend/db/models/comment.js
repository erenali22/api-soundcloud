"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Song, { foreignKey: "songId" });
      Comment.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Comment.init(
    {
      userId: DataTypes.INTEGER,
      songId: DataTypes.INTEGER,
      body: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );
  return Comment;
};
