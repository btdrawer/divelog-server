const express = require("express");
const router = express.Router();
const { GroupModel } = require("@btdrawer/divelog-server-utils").models;
const { authentication } = require("../middleware");
const { getUserId } = require("../utils/authUtils");
const { useHandlers } = require("../utils/routeUtils");
const runListQuery = require("../utils/runListQuery");

// Create new group and post first message
router.post(
    "/",
    authentication,
    useHandlers(req => {
        const userId = getUserId(req);
        return new GroupModel({
            name: req.body.group_name,
            participants: [...req.body.participants, userId],
            messages: [
                {
                    text: req.body.text,
                    sender: userId
                }
            ]
        });
    })
);

// Send message
router.post(
    "/:id/message",
    authentication,
    useHandlers(req =>
        GroupModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    messages: {
                        text: req.body.text,
                        sender: getUserId(req),
                        sent: new Date().getMilliseconds()
                    }
                }
            },
            { new: true }
        )
    )
);

// List groups the user participates in
router.get(
    "/",
    authentication,
    useHandlers(req =>
        runListQuery({
            model: GroupModel,
            filter: {
                participants: getUserId(req)
            }
        })(req)
    )
);

// Get group
router.get(
    "/:id",
    authentication,
    useHandlers(req => GroupModel.findById(req.params.id))
);

// Add member to group
router.post(
    "/:id/user/:userId",
    authentication,
    useHandlers(async req => {
        const group = await GroupModel.findById(req.params.id);
        await group.addUser(req.params.userId);
        return group;
    })
);

// Leave gronp
router.delete(
    "/:id/leave",
    authentication,
    useHandlers(req =>
        GroupModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    participants: getUserId(req)
                }
            },
            { new: true }
        )
    )
);

module.exports = router;
