const express = require('express');
const routes = require('./routes');

// database required to behave like a singleton. Import only once in app
const db = require('./persistence'); 

(async function () {
    await db.connect();
})();

const injectServices = (fn) => {
    return (req, res) => fn(req, res, db);
}

// Inject services into routes
Object.keys(routes).forEach(key => {
    routes[key] = injectServices(routes[key]); 
});

const { connect, addItem, getItems, getState } = routes;

const app = express();
 
app.use(express.json()); // Used to parse JSON bodies

app.use(express.static(__dirname + '/static'));

app.post('/connect', connect);

app.post('/item', addItem);

app.get('/items', getItems);

app.get('/state', getState); 

app.listen(8080, () => console.log('Listening on port 8080'));

