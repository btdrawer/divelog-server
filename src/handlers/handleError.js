module.exports = (res, err) => {
    console.log('err', err);
    res.status(400).send(err);
};