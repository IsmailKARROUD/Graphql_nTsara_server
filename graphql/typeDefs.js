export const typeDefs = `#graphql

type User {
  id: ID!
  UserName: String
  email: String!
  AndroidToken: String
  IOSToken: String
  Url_Profile_Picture: String
  JoinDate: String!
}
type Message {
  id: Int!
  ChatID: Int!
  message: String
  location: String
  senderID: ID!
  createdAt: String!
  updatedAt: String!
}
type PrivateChat {
  id: Int!
  userID: ID!
  friendID: ID!
}

type GroupChat {
  id: Int!
  CreatedBy: Int!
  name: String!
  pictureUrl: String
}

type Notification {
  id: Int!
  senderID: Int!
  receiversID: Int!
}

type Query {
  getUser(id: ID!): User
  getPrivateChat(id: ID!): PrivateChat
  getMessages(chatid:ID!): [Message!]
  # getGroupChat(id: Int!): GroupChat
  # getNotification(id: Int!): Notification
  # getMember(id:Int!):User
  # getMessage(id:Int!):Message
  # getMessages(chatID:Int!):[Message]
  # getReaders(chatID:int):[User]
  getAPrivateChat(uid:ID!,fid:ID!):[PrivateChat!]
  getAllPrivateChats(id: ID!): [PrivateChat!]!
  # getAllGroupChats(userID: Int!): [GroupChat!]!
  # getAllNotifications(userID: Int!): [Notification!]!
}

input UserInput {
  id:ID!
  UserName: String
  email: String!
  AndroidToken: String
  IOSToken: String
  Url_Profile_Picture: String
}

input MessageInput {
  ChatID: Int!
  message: String
  location: String
  senderID: ID!
}

input PrivateChatInput {
  userID: ID!
  friendID: ID!
}

input GroupChatInput {
  CreatedBy: Int!
  name: String!
  pictureUrl: String
}

input NotificationInput {
  senderID: Int!
  receiversID: Int!
}

type Mutation {
  createUser(user: UserInput!): User!
  createPrivateChat(privateChat: PrivateChatInput!): PrivateChat!
  createMessage(message: MessageInput!): Message!
  # createGroupChat(groupChat: GroupChatInput!): GroupChat!
  # createNotification(notification: NotificationInput!): Notification!
  # deleteUser(id: Int!): Boolean!
  # deletePrivateChat(id: Int!): Boolean!
  # deleteGroupChat(id: Int!): Boolean!
  # deleteNotification(id: Int!): Boolean!
  # updateUser(id: Int!, user: UserInput!): User!
  # updatePrivateChat(id: Int!, privateChat: PrivateChatInput!): PrivateChat!
  # updateGroupChat(id: Int!, groupChat: GroupChatInput!): GroupChat!
  # updateNotification(id: Int!, notification: NotificationInput!): Notification!
}

type Subscription {
    privateChats(userID:ID!): [PrivateChat]
    privatechat(chatID:Int!): Message
}

`;

