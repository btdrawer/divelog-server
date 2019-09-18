const express = require('express');
const router = express.Router();
const db = require('../db');
const Group = db.Group;
const Message = db.Message;
const handleSuccess = require('../handleSuccess');
const handleError = require('../handleError');

/* POST new group and first message */
router.post('/groups', (req, res) => 
    Group.create({
        name: req.body.group_name || 'New group',
        participants: req.body.participants
    })
    .then(group => Message.create({
        group: group.id,
        sender: req.body.sender_id,
        text: req.body.text
    }))
    .then(fields => handleSuccess('POST', res, fields))
    .catch(err => handleError(err, res))
);

/* POST new message */
router.post('/', (req, res) =>
    Message.create({
        group: req.body.group_id,
        sender: req.body.sender_id,
        text: req.body.text
    })
    .then(fields => handleSuccess('POST', res, fields))
    .catch(err => handleError(err, res))
);

/* GET list of groups */
router.get('/groups/all/:id', (req, res) =>
    Group.findAll({
        where: {
            participants: req.params.id
        }
    })
    .then(fields => handleSuccess('GET', res, fields))
    .catch(err => handleError(err, res))
);

/* GET group */
router.get('/groups/:id', (req, res) =>
    Group.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(fields => handleSuccess('GET', res, fields))
    .catch(err => handleError(err, res))
);

module.exports = router;