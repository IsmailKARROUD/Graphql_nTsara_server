import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

class Notification extends Model { }
Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chatID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverID: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    type: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'notification',
  }
);
export default Notification;