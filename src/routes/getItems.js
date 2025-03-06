
module.exports = async (req, res, db) => {
    let items;
    try {
        items = await db.getItems();
        console.log("items: ", items)
        res.send(items);
    }
    catch (err) {
        console.log("connection error");
        res.sendStatus(500);
    }
};