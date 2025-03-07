
module.exports = async (req, res, db) => {
    const host = req.body.name;
    (async function () {
        db.connection_error = null;
        db.connection_timed_out = false;
        await db.connect(host);
        const state = db.getState();
        res.send(state)
    })();
};