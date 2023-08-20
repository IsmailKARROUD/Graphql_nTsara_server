import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { APP_SECRET } from './constants.js';


export async function authenticateUser(request) {
  if (request != null && request.headers != null) {
    try {
      const header = await request?.headers.get('authorization')
      if (header != null) {
        // get the token 
        const token = header.split(' ')[1]
        // verify the token
        const tokenPayload = jwt.verify(token, APP_SECRET)
        // get the user id from the payload
        const userId = tokenPayload.payload.id
        // get all information of the user then return it 
        return await User.findOne({
          where: {
            id: userId
          }
        });
      }
    } catch (error) {
      console.error( error.message);
      return null; 
    }
  }

  return null
}