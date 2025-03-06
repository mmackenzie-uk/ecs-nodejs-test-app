
module.exports = async (req, res, db) => {
    const host = req.body.name;
    (async function () {
        await db.connect(host);
        const state = db.getState();
        res.send(state)
    })();
};