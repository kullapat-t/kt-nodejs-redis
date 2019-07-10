const express = require('express');
const con = require('./connector/redis-connector');
const conCb = require('./connector/redis-connector-callback');
const conPm = require('./connector/redis-connector-promise');
const app = express()
const port = 3000

app.get('/con', (req, res) => {
    // http://localhost:3000/con?id=5d21d19cdf68f60d202c1dac&date=1562660653
    res.send(con.validateDate(req.query.id, req.query.date))
});

app.get('/con-cb', (req, res) => {
    // http://localhost:3000/con-cb?id=5d21d19cdf68f60d202c1dac&date=1562660653
    conCb.validateDate(req.query.id, req.query.date, (response) => {
        res.send(response)
    })
});

app.get('/con-pm', (req, res) => {
    // http://localhost:3000/con-pm?id=5d21d19cdf68f60d202c1dac&date=1562660653
    conPm.validateDate(req.query.id, req.query.date)
        .then(response => {
            res.send(response)
        })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))