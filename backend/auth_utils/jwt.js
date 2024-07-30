import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//generate and verify tokens 
dotenv.config({ path: './.env' }); // Load environment variables

const secret = process.env.JWT_SECRET;

console.log('JWT_SECRET:', secret); // Log the secret to verify for debug

if (!secret) {
    throw new Error('JWT secret is not defined');
}

export const generateToken = (user, expiresIn = '1h') => {
    if (user.id == null || user.username == null || user.id < 1 || typeof user.username !== 'string' 
        || !/^[\w]+$/.test(user.username) || /^\d+$/.test(user.username) ) {
        throw new Error('Invalid user data');
    }

    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn});
    // console.log('Generated token:', token);
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    }catch(error){
        throw error;
    }
};