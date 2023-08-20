import User from "../models/User.js";
import Notification from "../models/Notification.js";
import PrivateChat from "../models/PrivateChat.js";
import GroupChat from "../models/groupChat.js";
import GroupMember from "../models/GroupMember.js";
import Message from "../models/Message.js";
import { sequelize } from "../config/database.js";
import { Op } from "sequelize";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

export const resolvers = {
    Query: {
        getUser: async (_, { id }) => {
            const user = await User.findByPk(id);
            return user;
        },
        me(_, { }, context) {
            if (context.currentUser === null) {
                throw new Error('Unauthenticated!')
            }

            return context.currentUser
        },

        getPrivateChat: async (_, { id }) => {
            const privateChat = await PrivateChat.findByPk(id);
            return privateChat;
        },
        getAPrivateChat: async (_, { uid, fid }) => {
            const privateChats = await PrivateChat.findAll({
                where: {
                    [Op.or]: [{
                        [Op.and]: [
                            { userID: uid },
                            { friendID: fid }
                        ]
                    }, {
                        [Op.and]: [
                            { userID: fid },
                            { friendID: uid }
                        ]
                    }]
                },
            });
            return privateChats;
        },
        getMessages: async (_, { chatid }) => {
            const messages = await Message.findAll({
                where: {
                    ChatID: chatid
                },
                order: [['createdAt', 'DESC']]
            });
            return messages;
        },
        getUserByUserName:  async (_, { userName }, { pubSub, APP_SECRET, context }) => {
            if (context=== null) {
                throw GraphQLError("No authenticated user yet.");
            } else {
                const user =  await User.findOne({
                    where: {
                        UserName: userName
                    }
                
            },)
            return user;
        }},
        searchUsersByUserName: async (_, { query }, { pubSub, APP_SECRET, context }) => {
            if (context=== null) {
                throw GraphQLError("No authenticated user yet.");
            } else {
                const users = await User.findAll(
                    {
                        where: {
                            UserName: {
                                [Op.startsWith]: query
                            }
                        },
                        order: [['UserName', 'ASC']]
                    }
                );
                return users;
            }
        },
        // getGroupChat: async (_, { id }) => {
        //     const groupChat = await GroupChat.findByPk(id);
        //     return groupChat;
        // },
        // getNotification: async (_, { id }) => {
        //     const notification = await Notification.findByPk(id);
        //     return notification;
        // },
        getAllPrivateChats: async (_, { id }) => {
            const privateChats = await PrivateChat.findAll({
                where: {
                    [Op.or]: [
                        { userID: id },
                        { friendID: id }
                    ]
                },
            });
            return privateChats;
        },
        // getAllGroupChats: async (id) => {
        //     const groupChats = await GroupChat.findAll();
        //     return groupChats;
        // },
        // getAllNotifications: async (id) => {
        //     const notifications = await Notification.findAll();
        //     return notifications;
        // },
    },
    Mutation: {
        register: async (_, { user }) => {
            const _user = User.build(user);
            console.log(user);
            try {
                const existinguser = await User.findAll({
                    where: {
                        [Op.or]: [{ UserName: user.UserName },
                        { email: user.email }]
                    },
                });
                if (existinguser.length > 0) {

                    throw new Error('The username alrady chosen.');
                }
                await _user.validate();
            } catch (error) {
                const errorMessages = error.errors.map((err) => err.message);
                throw new Error(errorMessages);
            }
            _user.passWord = await bycrypt.hash(_user.passWord, 12);
            await _user.save();
            return _user;
        },
        login: async (_, { email, passWord }, { pubSub, APP_SECRET }) => {
            try {
                const theUser = await User.findOne({
                    where: {
                        email: email
                    }
                });
                if (!theUser) {
                    throw new GraphQLError('No User with this email has been registered!')
                }
                const valid = await bycrypt.compare(passWord, theUser.passWord);
                if (!valid) {
                    throw new GraphQLError('Incorrect password');
                }
                const payload = {
                    id: theUser.id,
                    UserName: theUser.UserName,
                    email: theUser.email,
                    IOSToken: theUser.IOSToken,
                    AndroidToken: theUser.AndroidToken,
                    Url_Profile_Picture: theUser.Url_Profile_Picture,
                    JoinDate: theUser.JoinDate,
                };
                const token = jwt.sign(
                    { payload },
                    APP_SECRET,
                    { expiresIn: "7 days" }
                );
                return token;
            } catch (error) {
                throw error;
            }
        },
        
        createPrivateChat: async (_, { privateChat }, { pubSub }) => {
            try {
                if (privateChat.userID !== privateChat.friendID) {

                    const existingPrivateChats = await resolvers.Query.getAPrivateChat(
                        _,
                        { uid: privateChat.userID, fid: privateChat.friendID }
                    );

                    if (existingPrivateChats.length > 0) {

                        throw new Error('Private chat already exists between these users.');
                    }

                    const newPrivateChat = await PrivateChat.create(privateChat);
                    pubSub.publish('PrivateChat' + privateChat.friendID, newPrivateChat);
                    pubSub.publish('PrivateChat' + privateChat.userID, newPrivateChat);
                    return newPrivateChat;
                } else {
                    throw new Error(
                        "Cannot create private chat with oneself!\nThe user has the same id as the friend!"
                    );
                }
            } catch (error) {
                throw error;
            }
        },
        async createMessage(_, { message }, { pubSub }) {
            try {
                const newMessage = await Message.create(message);
                pubSub.publish('newPrivateMessage' + message.ChatID, newMessage);
                return newMessage;
            } catch (error) {
                throw new Error(error);
            }
        },

        // createGroupChat: async (_, { groupChat }) => {

        //     try {
        //         createdGroupChat = await GroupChat.create(groupChat);
        //          await GroupMember.create({ userID: groupV.CreatedBy, groupID: groupV.id });
        //         return createdGroupChat;

        //     } catch (error) {
        //         throw error;
        //     }}

        // },
        // createNotification: async (_, { notification }) => {
        //     const newNotification = await Notification.create(notification);
        //     return newNotification;
        // },
        // deleteUser: async (_, { id }) => {
        //     const deletedUser = await User.destroy({ where: { id } });
        //     return deletedUser > 0;
        // },
        // deletePrivateChat: async (_, { id }) => {
        //     const deletedPrivateChat = await PrivateChat.destroy({ where: { id } });
        //     return deletedPrivateChat > 0;
        // },
        // deleteGroupChat: async (_, { id }) => {
        //     const deletedGroupChat = await GroupChat.destroy({ where: { id } });
        //     return deletedGroupChat > 0;
        // },
        // deleteNotification: async (_, { id }) => {
        //     const deletedNotification = await Notification.destroy({ where: { id } });
        //     return deletedNotification > 0;
        // },
        // updateUser: async (_, { id, user }) => {
        //     const updatedUser = await User.update(user, { where: { id } });
        //     return updatedUser > 0 ? await User.findByPk(id) : null;
        // },
        // updatePrivateChat: async (_, { id, privateChat }) => {
        //     const updatedPrivateChat = await PrivateChat.update(privateChat, { where: { id } });
        //     return updatedPrivateChat > 0 ? await PrivateChat.findByPk(id) : null;
        // },
        // updateGroupChat: async (_, { id, groupChat }) => {
        //     const updatedGroupChat = await GroupChat.update(groupChat, { where: { id } });
        //     return updatedGroupChat > 0 ? await GroupChat.findByPk(id) : null;
        // },
        // updateNotification: async (_, { id, notification }) => {
        //     const updatedNotification = await Notification.update(notification, { where: { id } });
        //     return updatedNotification > 0 ? await Notification.findByPk(id) : null;
        // },
    },
    Subscription: {
        privateChats: {
            subscribe: (_, { userID }, { pubSub }) => pubSub.subscribe("PrivateChat" + userID),
            resolve: (payload) => { return [payload]; },
        },
        privatechat: {
            subscribe: (_, { chatID }, { pubSub }) => pubSub.subscribe('newPrivateMessage' + chatID),
            resolve: (payload) => { return [payload]; },

        },
    },

};
