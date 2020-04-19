const express = require("express");
const router = express.Router();
const GroupModel = require("../models/GroupModel");
const middleware = require("../authentication/middleware");
const { getUserID } = require("../authentication/authUtils");
const routeBuilder = require("../utils/routeBuilder");
const handleSuccess = require("../handlers/handleSuccess");
const handleError = require("../handlers/handleError");

// Create new group and post first message
router.post("/", middleware, async (req, res) => {
    const myId = getUserID(req);
    req.body.participants.push(myId);

    await routeBuilder.post({
        model: GroupModel,
        res,
        payload: {
            name: req.body.group_name,
            participants: req.body.participants,
            messages: [
                {
                    text: req.body.text,
                    sender: myId
                }
            ]
        }
    });
});

router.post("/:id/message", middleware, (req, res) =>
    routeBuilder.put({
        model: GroupModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $push: {
                messages: {
                    text: req.body.text,
                    sender: getUserID(req),
                    sent: new Date().getMilliseconds()
                }
            }
        }
    })
);

// List groups the user participates in
router.get("/", middleware, async (req, res) =>
    routeBuilder.getAll({
        model: GroupModel,
        req,
        res,
        filter: {
            participants: getUserID(req)
        }
    })
);

// Get group
router.get("/:id", middleware, async (req, res) =>
    routeBuilder.getOne({
        model: GroupModel,
        req,
        res,
        filter: {
            _id: req.params.id
        }
    })
);

// Add member to group
router.post("/:id/user/:userId", middleware, async (req, res) => {
    try {
        const group = await GroupModel.findOne({
            _id: req.params.id
        });

        await group.addUser(req.params.userId);

        handleSuccess(res, group, "POST");
    } catch (err) {
        handleError(res, err);
    }
});

// Leave gronp
router.delete("/:id/leave", middleware, (req, res) =>
    routeBuilder.put({
        model: GroupModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $pull: {
                participants: getUserID(req)
            }
        }
    })
);

module.exports = router;
