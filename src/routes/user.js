const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const middleware = require("../middleware");
const getUserID = require("../authentication/helpers/getUserID");
const errorKeys = require("../variables/errorKeys");
const handleSuccess = require("../handlers/handleSuccess");
const handleError = require("../handlers/handleError");
const routeBuilder = require("../helpers/routeBuilder");

// Create new user
router.post("/", (req, res) =>
  routeBuilder.post(UserModel, res, {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  })
);

// Login
router.post("/login", async (req, res) =>
  routeBuilder.generic(
    UserModel,
    "authenticate",
    res,
    "POST",
    req.body.username,
    req.body.password
  )
);

// Send or accept friend request
router.post("/friend/:id", middleware, async (req, res) => {
  try {
    let myId = await getUserID(req);
    let friendId = req.params.id;

    if (myId === friendId) {
      throw new Error(errorKeys.CANNOT_ADD_YOURSELF);
    }

    const checkInbox = await UserModel.findOne(
      {
        _id: myId
      },
      ["friend_requests", "friends"]
    );

    let user;

    if (checkInbox.friend_requests.sent.includes(friendId)) {
      throw new Error(errorKeys.FRIEND_REQUEST_ALREADY_SENT);
    } else if (checkInbox.friends.includes(friendId)) {
      throw new Error(errorKeys.ALREADY_FRIENDS);
    } else if (checkInbox.friend_requests.inbox.includes(friendId)) {
      // Accept request
      user = await UserModel.accept(myId, friendId);
    } else {
      // Send request
      user = await UserModel.add(myId, friendId);
    }

    handleSuccess(res, user, "POST");
  } catch (err) {
    handleError(res, err);
  }
});

// Unfriend
router.delete("/friend/:id", middleware, (req, res) =>
  routeBuilder.generic(
    UserModel,
    "unfriend",
    res,
    "DELETE",
    getUserID(req),
    req.params.id
  )
);

// List all users
router.get("/", middleware, (req, res) =>
  routeBuilder.getAll(UserModel, res, {}, ["name", "username"])
);

// Get user by ID
router.get("/:id", middleware, async (req, res) => {
  let id, fieldsToReturn;

  if (req.params.id === "me") {
    id = getUserID(req);
    fieldsToReturn = ["name", "username", "friends", "friend_requests"];
  } else {
    id = req.params.id;
    fieldsToReturn = ["name", "username"];
  }

  await routeBuilder.getOne(
    UserModel,
    res,
    {
      _id: id
    },
    fieldsToReturn
  );
});

// Update user details
router.put("/", middleware, (req, res) =>
  routeBuilder.put(
    UserModel,
    res,
    {
      _id: getUserID(req)
    },
    req.body
  )
);

// Delete user
router.delete("/", middleware, (req, res) =>
  routeBuilder.delete(UserModel, res, {
    _id: getUserID(req)
  })
);

module.exports = router;
