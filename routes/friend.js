const express = require('express');
const router = express.Router();
const Friend = require('../models').Friend;
const handleSuccess = require('../handleSuccess');
const handleError = require('../handleError');

/* POST new friend request */
router.post('/:id0/:id1', (req, res) =>
    Friend.create({
        user0Id: req.params.id0,
        user1Id: req.params.id1,
        accepted: false
    })
    .then(fields => handleSuccess('POST', res, fields))
    .catch(err => handleError(err, res))
);

/* POST accept friend request */
router.put('/:id0/:id1', (req, res) =>
    Friend.findOne({
        where: {
            user0Id: req.params.id0,
            user1Id: req.params.id1
        }
    })
    .then(fields => {
        if (fields) {
            Friend.update(
                {
                    accepted: true
                },
                {
                    where: {
                        id: fields.id
                    }
                })
            }
        }
    )
    .then(fields => handleSuccess('PUT', res, fields))
    .catch(err => handleError(err, res))
);

/* DELETE friend or friend request */
router.delete('/:id0/:id1', (req, res) =>
    Friend.findOne({
        where: {
            user0Id: req.params.id0,
            user1Id: req.params.id1
        }
    })
    .then(fields => Friend.destroy({
        where: {
            id: fields.id
        }
    }))
    .then(fields => handleSuccess('DELETE', res, fields))
    .catch(err => handleError(err, res))
);

module.exports = router;