import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class GroupMember extends Model {}

GroupMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    groupID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
      
  },
  {
    sequelize,
    modelName: 'groupMember',
    updatedAt:false
  }
);

export default GroupMember;