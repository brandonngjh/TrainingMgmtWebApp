
const { generateToken, verifyToken } = require('../auth_utils/jwt.js'); // Adjust the path accordingly
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path:'./.env'})

const user = { id: 1, username: 'testuser' };
const secret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', process.env.JWT_SECRET);

describe('generateToken', () => {
    it('should generate a token', () => {
        const token = generateToken(user);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should have correct payload', () =>{
        const token = generateToken(user);
        const decoded = jwt.decode(token);
        expect(decoded).toMatchObject({ id: user.id, username: user.username });
    });
});