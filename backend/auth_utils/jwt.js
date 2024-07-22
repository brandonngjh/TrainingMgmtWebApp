import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//generate and verify tokens 
dotenv.config({ path: '../.env' }); // Load environment variables

const secret = process.env.JWT_SECRET;

console.log('JWT_SECRET:', secret); // Log the secret to verify for debug

if (!secret) {
    throw new Error('JWT secret is not defined');
}

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
    // console.log('Generated token:', token);
};

export const verifyToken = (token) => {
    return jwt.verify(token, secret);
};