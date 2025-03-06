const {v4 : uuid} = require('uuid');

module.exports = async (req, res, db) => {
    const item = {
        id: uuid(),
        name: "Mark",
        completed: false,
    };

    try {
        await db.storeItem(item);
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
