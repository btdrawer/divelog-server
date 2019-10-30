const express = require("express");
const router = express.Router();
const GroupModel = require("../models/group");
const middleware = require("../middleware");
const getUserID = require("../authentication/getUserID");
const routeBuilder = require("../routeBuilder");
const handleSuccess = require("../handlers/handleSuccess");
const handleError = require("../handlers/handleError");

// Create new group and post first message
router.post("/", middleware, async (req, res) => {
  const myId = getUserID(req);
  req.body.participants.push(myId);

  await routeBuilder.post(GroupModel, res, {
    name: req.body.group_name,
    participants: req.body.participants,
    messages: [
      {
        text: req.body.text,
        sender: myId
      }
    ]
  });
});

router.post("/:id/message", middleware, (req, res) =>
  routeBuilder.put(
    GroupModel,
    res,
    {
      _id: req.params.id
    },
    {
      $push: {
        messages: {
          text: req.body.text,
          sender: getUserID(req),
          sent: new Date().getMilliseconds()
        }
      }
    }
  )
);

// List groups the user participates in
router.get("/", middleware, (req, res) =>
  routeBuilder.getAll(GroupModel, res, {
    participants: getUserID(req)
  })
);

// Get group
router.get("/:id", middleware, (req, res) =>
  routeBuilder.getOne(GroupModel, res, {
    _id: req.params.id
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
  routeBuilder.put(
    GroupModel,
    res,
    {
      _id: req.params.id
    },
    {
      $pull: {
        participants: getUserID(req)
      }
    }
  )
);

module.exports = router;
