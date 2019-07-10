const redis = require("redis"), client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

const validateDate = (userId, date) => {
    console.log(`validate userId: [${userId}] . . .`);
    return new Promise((resolve, reject) => {
        return client.get(userId, (err, currentDate) => {
            if(currentDate) {
                console.log(`date: ${date}, currentDate: ${currentDate}`);

                if (date == currentDate) {
                    console.log("> do nothing (same date)");
                    resolve({
                        msg: `do nothing (same date: [${date}])`,
                        data: { userId: `${userId}`, date: `${date}` }
                    });
                    return;
                }

                date > currentDate ?
                    saveDate(userId, date)
                        .then(newDate => {
                            resolve({
                                msg: `save new date [${newDate}]`,
                                data: { userId: `${userId}`, date: `${newDate}` }
                            })
                        }) :
                    resolve({
                        msg: `current date [${currentDate}] is greater than req date [${date}]`,
                        data: { userId: `${userId}`, date: `${date}` }
                    })
            } else {
                console.log(`no date for ${userId}`);
                saveDate(userId, date)
                    .then(newDate => {
                        resolve({
                            msg: `save new date [${newDate}]`,
                            data: { userId: `${userId}`, date: `${newDate}` }
                        })
                    })
            }
        });
    });
};

const saveDate = (userId, date) => {
    console.log(`> save new date for ${userId} . . .`);
    return new Promise((resolve, reject) => {
        client.set(userId, date, function (err, reply) {
            if (err) { console.log("error: " + err); return; }
            resolve(date)
        });
    });
};

module.exports = {
    validateDate
};