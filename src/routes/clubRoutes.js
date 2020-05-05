const express = require("express");
const router = express.Router();
const {
    UserModel,
    ClubModel
} = require("@btdrawer/divelog-server-utils").models;
const { getUserId } = require("../utils/authUtils");
const middleware = require("../middleware/authentication");
const routeBuilder = require("../utils/routeBuilder");

// Create new club
router.post("/", middleware, (req, res) =>
    routeBuilder.post({
        model: ClubModel,
        res,
        payload: {
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            managers: [getUserId(req)],
            members: req.body.members,
            website: req.body.website
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.manager",
                id: getUserId(req)
            }
        ]
    })
);

// List all clubs
router.get("/", middleware, (req, res) => {
    const filter = {};
    const { name, location } = req.query;
    if (name) filter.name = name;
    if (location) filter.location = location;

    routeBuilder.getAll({
        model: ClubModel,
        req,
        res,
        filter
    });
});

// Get club by ID
router.get("/:id", middleware, (req, res) =>
    routeBuilder.getOne({
        model: ClubModel,
        req,
        res,
        filter: {
            _id: req.params.id
        },
        fieldsToPopulate: ["managers", "members"]
    })
);

// Update club
router.put("/:id", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            website: req.body.website
        }
    })
);

// Add manager
router.post("/:id/manager/:managerId", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $push: {
                managers: req.params.managerId
            }
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.manager",
                id: req.params.managerId
            }
        ]
    })
);

// Delete manager
router.delete("/:id/manager/:managerId", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $pull: {
                managers: req.params.managerId
            }
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.manager",
                id: req.params.managerId
            }
        ]
    })
);

// Add member
router.post("/:id/member/:memberId", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $push: {
                members: req.params.memberId
            }
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.member",
                id: req.params.memberId
            }
        ]
    })
);

// Delete member
router.delete("/:id/member/:memberId", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $pull: {
                members: req.params.memberId
            }
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.member",
                id: req.params.memberId
            }
        ]
    })
);

// Join group
router.post("/:id/member", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $push: {
                members: getUserId(req)
            }
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.member",
                id: getUserId(req)
            }
        ]
    })
);

// Leave group
router.delete("/:id/member", middleware, (req, res) =>
    routeBuilder.put({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        },
        payload: {
            $pull: {
                members: getUserId(req)
            }
        },
        additionalRequests: [
            {
                model: UserModel,
                ref: "clubs.member",
                id: getUserId(req)
            }
        ]
    })
);

// Delete club
router.delete("/:id", middleware, (req, res) =>
    routeBuilder.delete({
        model: ClubModel,
        res,
        filter: {
            _id: req.params.id
        }
    })
);

module.exports = router;
