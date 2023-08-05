
class MessageReader extends Model {}

MessageReader.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'messageReader',
  }
);

export default MessageReader;