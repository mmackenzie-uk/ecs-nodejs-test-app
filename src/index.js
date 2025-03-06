const express = require('express');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const connect = require('./routes/connect');
const getState = require('./routes/getState');

// required to behave like a singleton. Import only once in app
const db = require('./persistence'); 

const injectServices = (fn) => {
    return (req, res) => fn(req, res, db);
}

const app = express();

(async function () {
    await db.connect();
})();

app.use(express.json()); // Used to parse JSON bodies

app.use(express.static(__dirname + '/static'));

// Routes

app.post('/connect', injectServices(connect));

app.post('/item', injectServices(addItem));

app.get('/items', injectServices(getItems));

app.get('/state', injectServices(getState)); 


app.listen(8080, () => console.log('Listening on port 8080'));

