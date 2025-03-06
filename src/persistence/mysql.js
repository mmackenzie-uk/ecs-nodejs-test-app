// required to behave like a singleton. Import only once in app

const mysql = require('mysql2');
const { HOST, USER, PASSWORD, DATABASE } = require('../config');

let pool;
let count = 0;
let connection_error = null;
let connection_timed_out = false;

function connect(host = HOST) {
    return new Promise((accept, reject) => {
        const myInterval = setInterval(myTimer, 1000);     
        let index = 0;
        let isConnected = false;
        count = 0;
        connection_error = null;
        connection_timed_out = false;
        const retry = async () => {
            isConnected = await init(host);
        }
        function myTimer() {   
            console.log("index ", index, "isConnected ", isConnected, "host ", host)
    
            if(index === 30) {
                count = 30;
                connection_timed_out = true;
                clearInterval(myInterval);
                accept(index);
            }       
            if(isConnected) {
                count = index;
                clearInterval(myInterval);
                accept(index);
            }     
            retry(); 
            index = index + 1;
        }
    });
}


async function init(host) {
    pool = mysql.createPool({
        connectionLimit: 5,
        host: host,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        charset: 'utf8mb4',
    });

    return new Promise((accept, reject) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean) DEFAULT CHARSET utf8mb4',
            (err, results) => {
                try {   
                    if (err) {
                        connection_error = err;
                        accept(false);
                    }
                    accept(true)
                } catch (e) {
                    reject(false);
                }
            },
        );
     
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM todo_items', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ),
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}


module.exports = {
    getItems,
    storeItem,
    connect,
    getState: () => ({ count, connection_error, connection_timed_out })
};
