const redis = require("redis"), client = redis.createClient();

client.on('connect', () => { console.log('Redis client connected') });
client.on('error', err => { console.error(`Something went wrong: ${err}`) });

const validateDate = (userId, date) => {
    console.log(`validate userId: [${userId}] . . .`);

    return client.get(userId, (err, currentDate) => {
        if(currentDate) {
            console.log(`date: ${date}, currentDate: ${currentDate}`);

            if (date == currentDate) {
                console.log(`do nothing (same date: [${date}])`);
                return
            }

            date > currentDate ?
                saveDate(userId, date):
                console.log(`> current date [${currentDate}] is greater than req date [${date}]`)
        } else {
            console.log(`no date for ${userId}`);
            saveDate(userId, date)
        }
    });
};

const saveDate = (userId, date) => {
    console.log(`> save new date for ${userId} . . .`);
    client.set(userId, date, (err) => {
        if (err) { console.error("error: " + err); }
        return
    });
};

module.exports = {
    validateDate
};