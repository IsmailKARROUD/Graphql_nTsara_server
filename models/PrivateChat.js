import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class PrivateChat extends Model {}
PrivateChat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      unique: true,
    },
    userID: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'userFriendIndex',
    },
    friendID: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'userFriendIndex',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'privateChat',
    
  }
);

export default PrivateChat;