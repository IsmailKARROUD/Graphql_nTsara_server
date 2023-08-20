'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
        unique:true
      },
      UserName: {
        type: Sequelize.STRING,
        allowNull: true,
        notEmpty:false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        notEmpty: true, 
      },
      passWord : {
        type: Sequelize.STRING,
        allowNull : false,
        notEmpty: true
      },
      IOSToken: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      AndroidToken: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      Url_Profile_Picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      JoinDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
