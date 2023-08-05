import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { validate } from "graphql";

class User extends Model { }
User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      
    },
    UserName:{ type:DataTypes.STRING,
      unique:true,
      allowNull:true,
    validate:{
    is: { args :['^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'],
      msg: 'Must be a valid userName',}
    }},
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email cannot be empty',
        },
        is: {
          args: ['^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'],
          msg: 'Must be a valid email address',
        },
      },
    },
    IOSToken: DataTypes.STRING,
    AndroidToken: DataTypes.STRING,
    Url_Profile_Picture: {type:DataTypes.STRING,
      allowNull:true,
      notEmpty: false,
    validate:{
      
      isUrl: {
        args: true,
        msg: 'Must be a valid link',
      },
    },},
    JoinDate: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "user",
    createdAt: 'JoinDate',
    updatedAt: false,
  }
);

export default User;
