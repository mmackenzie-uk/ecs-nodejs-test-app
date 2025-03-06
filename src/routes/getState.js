
module.exports = async (req, res, db) => {
    const state = db.getState();
    console.log("state", state)
    res.send(state);
};