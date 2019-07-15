const redis = require("redis"), client = redis.createClient();

client.on('connect', () => { console.log('Redis client connected') });
client.on('error', err => { console.error(`Something went wrong: ${err}`) });

const validateDate = (userId, date, callback) => {
    console.log(`validate userId: [${userId}] . . .`);

    return client.get(userId, (err, currentDate) => {
        if(currentDate) {
            console.log(`date: ${date}, currentDate: ${currentDate}`);

            if (date == currentDate) {
                console.log("> do nothing (same date)");
                callback({
                    msg: `do nothing (same date: [${date}])`,
                    data: { userId: `${userId}`, date: `${date}` }
                });
                return;
            }

            date > currentDate ?
                saveDate(userId, date, callback):
                callback({
                    msg: `current date [${currentDate}] is greater than req date [${date}]`,
                    data: { userId: userId, date: date }
                })
        } else {
            console.log(`no date for ${userId}`);
            saveDate(userId, date, callback)
        }
    });
};

const saveDate = (userId, date, callback) => {
    console.log(`> save new date for ${userId} . . .`);
    client.set(userId, date, (err) => {
        if (err) { console.error("error: " + err); return; }
        callback({
            msg: `save new date [${date}]`,
            data: { userId: userId, date: date }
        })
    });
};

module.exports = {
    validateDate
};