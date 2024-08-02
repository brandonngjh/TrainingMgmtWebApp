import { generateToken, verifyToken } from '../auth_utils/jwt.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fc from 'fast-check';

dotenv.config({path:'./.env'})  //get secret

const user = { id: 1, username: 'testuser' };
const secret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const whitespace = /^[\w]+$/;
const digits = /^\d/;

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    if (console.error.mockRestore) {
        console.error.mockRestore();
    };
  });

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

    it('should expire after the specified time', (done) => {
        fc.assert(
            fc.property(fc.integer({min:1, max: 5}), (expiresIn) => {
                const token = jwt.sign({ id: user.id, username: user.username }, secret, {expiresIn});
                setTimeout(() => {
                    try {
                        verifyToken(token);
                    } catch (error) {
                        expect(error.name).toBe('TokenExpiredError');
                        done();
                    }
        }, 1100);
            })
        )
        
    });
    // valid regions
    it('should accept valid input', () => {     //boundary testing with fast-check
        fc.assert(
            fc.property(fc.integer({min: 1}), fc.string({minLength: 1}).filter(str => whitespace.test(str) && !digits.test(str)), (id, username) => {
                const user = {id, username};
                const token = generateToken(user);
                const decoded = verifyToken(token);

                    expect(decoded).not.toBeNull();
                    expect(typeof decoded).toBe('object');
                    expect(decoded.id).toBe(user.id);
                    expect(decoded.username).toBe(user.username);
            })
        )
    })
    // invalid region
    it('should throw error if invalid input', () => {   //boundary testing with fast-check
        fc.assert(
            fc.property(fc.integer(), fc.string(), (id, username) => {
                const user = {id, username};
                if (user.id == null || user.username == null || user.id < 1 || typeof user.username !== 'string'
                    || !/^[\w]+$/.test(user.username) || /^\d+$/.test(user.username)) {
                    expect(() => generateToken(user)).toThrow('Invalid user data');
                }
            })
        )
    })        
})

describe('verifyToken', () => {
    it('should verify a valid token', () => {
        const user = { id: 1, username: 'admin' };
        const token = generateToken(user);
        const decoded = verifyToken(token);
        expect(decoded).toMatchObject({ id: user.id, username: user.username });
    });

    it('should fail to verify invalid token', () => {
        
                    const user = { id: 3, username: 'hod' };
                    const token = generateToken(user);
                    const invalidToken = token.slice(0, -1) + 'x';

                    // Verify the tampered token should throw an error
                    expect(() => verifyToken(invalidToken)).toThrow();
                    })

    });


