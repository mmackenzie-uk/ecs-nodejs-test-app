const {v4 : uuid} = require('uuid');

module.exports = async (req, res, db) => {
    const name = req.body.name;
    const item = {
        id: uuid(),
        name,
        completed: false,
    };

    try {
        await db.storeItem(item);
        res.send(item);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
