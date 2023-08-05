import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class GroupChat extends Model {}
GroupChat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      unique: true,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pictureUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'groupChat',
    updatedAt: false,
  }
);

export default GroupChat;