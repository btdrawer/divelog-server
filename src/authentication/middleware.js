const { getAuthData } = require("./authTools");
const routerUrls = require("../variables/routerUrls");

// Models
const UserModel = require("../models/User");
const ClubModel = require("../models/club");
const DiveModel = require("../models/dive");
const GearModel = require("../models/gear");
const GroupModel = require("../models/group");

// Error handling
const handleError = require("../handlers/handleError");
const {
  INVALID_AUTH,
  NOT_FOUND,
  FORBIDDEN
} = require("../variables/errorKeys");

module.exports = async (req, res, next) => {
  const { token, data } = getAuthData(req);

  try {
    const user = await UserModel.findOne({
      _id: data._id,
      token: token
    });

    if (!user) throw new Error(INVALID_AUTH);

    // Additional middleware for individual resources
    switch (req.baseUrl) {
      case routerUrls.DIVE:
        await diveMiddleware(req, data);
        break;
      case routerUrls.CLUB:
        await clubMiddleware(req, data);
        break;
      case routerUrls.GEAR:
        await gearMiddleware(req, data);
        break;
      case routerUrls.GROUP:
        await groupMiddleware(req, data);
        break;
      default:
        break;
    }

    next();
  } catch (err) {
    handleError(res, err);
  }
};

const diveMiddleware = async (req, data) => {
  if (req.method !== "POST" && req.params.id) {
    const dive = await DiveModel.findOne({
      _id: req.params.id
    });

    if (!dive) throw new Error(NOT_FOUND);
    else if (
      dive.user.toString() !== data._id.toString() &&
      !(req.method === "GET" && dive.public)
    ) {
      throw new Error(FORBIDDEN);
    }
  }
};

const clubMiddleware = async (req, data) => {
  if (req.method !== "POST" && req.params.id) {
    const club = await ClubModel.findOne({
      _id: req.params.id
    });

    if (!club) throw new Error(NOT_FOUND);
    else if (req.method === "PUT" || req.method === "DELETE") {
      if (!club.managers.includes(data._id.toString())) {
        throw new Error(FORBIDDEN);
      }
    }
  }
};

const gearMiddleware = async (req, data) => {
  if (req.method !== "POST" && req.params.id) {
    const gear = await GearModel.findOne({
      _id: req.params.id
    });

    if (!gear) throw new Error(NOT_FOUND);
    else if (gear.owner.toString() !== data._id.toString())
      throw new Error(FORBIDDEN);
  }
};

const groupMiddleware = async (req, data) => {
  if (req.params.id) {
    const group = await GroupModel.findOne({
      _id: req.params.id
    });

    if (!group) throw new Error(NOT_FOUND);
    else if (!group.participants.includes(data._id.toString())) {
      throw new Error(FORBIDDEN);
    }
  }
};
