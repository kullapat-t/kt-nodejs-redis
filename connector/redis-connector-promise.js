const redis = require("redis"), client = redis.createClient(6379, "localhost")

client.on('connect', () => { console.log('Redis client connected') });
client.on('error', err => { console.error(`Something went wrong: ${err}`) });

const validateDate = (userId, date) => {
    console.log(`validate userId: [${userId}] . . .`);
    return new Promise((resolve, reject) => {
        return client.get(userId, (err, currentDate) => {
            if(err) {
                reject(new Error(err))
            }
            if(currentDate) {
                console.log(`date: ${date}, currentDate: ${currentDate}`);

                if (date == currentDate) {
                    console.log("> do nothing (same date)");
                    resolve({
                        msg: `do nothing (same date: [${date}])`,
                        data: { userId: userId, date: date }
                    });
                    return;
                }
                date > currentDate ?
                    saveDate(userId, date)
                        .then(newDate => {
                            resolve({
                                msg: `save new date [${newDate}]`,
                                data: { userId: userId, date: newDate }
                            })
                        }) :
                    resolve({
                        msg: `current date [${currentDate}] is greater than req date [${date}]`,
                        data: { userId: userId, date: date }
                    })
            } else {
                console.log(`no date for ${userId}`);
                saveDate(userId, date)
                    .then(newDate => {
                        resolve({
                            msg: `save new date [${newDate}]`,
                            data: { userId: userId, date: newDate }
                        })
                    })
            }
        });
    });
};

const saveDate = (userId, date) => {
    console.log(`> save new date for ${userId} . . .`);
    return new Promise((resolve, reject) => {
        client.set(userId, date, (err) => {
            if (err) {
                reject(new Error(err))
            }
            resolve(date)
        });
    });
};

module.exports = {
    validateDate
};