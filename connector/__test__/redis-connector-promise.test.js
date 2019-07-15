jest.mock('redis', () => ({
    createClient: () => {
        return {
            on: () => {},
            get: (userId, cb) => {
                if (userId == 'no-user') {
                    cb(false, undefined)
                } else {
                    cb(false, 1000)
                }
            },
            set: (userId, iat, cb) => {
                cb(false, 'this is the reply')
            }
        }
    }
}));
const { validateDate } = require('../redis-connector-promise');

describe('Validate date', () => {
    test('date is equal to the current, return current date', () => {
        const result = validateDate('001', 1000);
        return expect(result).resolves.toEqual({
            msg: "do nothing (same date: [1000])",
            data: { userId: '001', date: 1000 }
        })
    });

    test('date is grater than the current, save new date', () => {
        const result = validateDate('001', 1500);
        return expect(result).resolves.toEqual({
            msg: "save new date [1500]",
            data: { userId: '001', date: 1500 }
        })
    });

    test('no user data, save new date', () => {
        const result = validateDate('no-user', 999);
        return expect(result).resolves.toEqual({
            msg: "save new date [999]",
            data: { userId: 'no-user', date: 999 }
        })
    });

    test('date is less than current, throw AuthenticationError(User already logged in)', () => {
        const result = validateDate('001', 800);
        return expect(result).resolves.toEqual({
            msg: "current date [1000] is greater than req date [800]",
            data: { userId: '001', date: 800 }
        })
    });
});
