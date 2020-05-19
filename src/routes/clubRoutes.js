const express = require("express");
const router = express.Router();
const {
    UserModel,
    ClubModel
} = require("@btdrawer/divelog-server-utils").models;
const { getUserId } = require("../utils/authUtils");
const middleware = require("../middleware/authentication");
const {
    filterPayload,
    populateFields,
    useHandlers
} = require("../utils/routeUtils");
const runListQuery = require("../utils/runListQuery");

const ARR_PUSH = "$push";
const ARR_PULL = "$pull";

const updateArrayTemplate = async ({ club, user, arrayAction }) => {
    const result = await ClubModel.findByIdAndUpdate(
        club.id,
        {
            [arrayAction]: {
                [club.arr]: user.id
            }
        },
        { new: true }
    );
    await UserModel.findByIdAndUpdate(user.id, {
        [arrayAction]: {
            [user.arr]: club.id
        }
    });
    return result;
};

// Create new club
router.post(
    "/",
    middleware,
    useHandlers(async req => {
        const club = new ClubModel({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            managers: [getUserId(req)],
            members: req.body.members,
            website: req.body.website
        }).save();
        await UserModel.findByIdAndUpdate(getUserId(req), {
            $push: {
                "clubs.manager": club.id
            }
        });
        return club;
    })
);

// List all clubs
router.get(
    "/",
    middleware,
    useHandlers(req =>
        runListQuery({
            model: ClubModel,
            filter: filterPayload({
                name: req.query.name,
                location: req.query.location
            }),
            useCache: true
        })(req)
    )
);

// Get club by ID
router.get(
    "/:id",
    middleware,
    useHandlers(req =>
        populateFields(
            () => ClubModel.findById(req.params.id, req.query.fields),
            ["managers", "members"]
        )
    )
);

// Update club
router.put(
    "/:id",
    middleware,
    useHandlers(req =>
        ClubModel.findByIdAndUpdate(
            req.params.id,
            filterPayload({
                name: req.body.name,
                location: req.body.location,
                description: req.body.description,
                website: req.body.website
            }),
            { new: true }
        )
    )
);

// Add manager
router.post(
    "/:id/manager/:managerId",
    middleware,
    useHandlers(req =>
        updateArrayTemplate({
            club: {
                id: req.params.id,
                arr: "managers"
            },
            user: {
                id: req.params.managerId,
                arr: "clubs.manager"
            },
            arrayAction: ARR_PUSH
        })
    )
);

// Delete manager
router.delete(
    "/:id/manager/:managerId",
    middleware,
    useHandlers(req =>
        updateArrayTemplate({
            club: {
                id: req.params.id,
                arr: "managers"
            },
            user: {
                id: req.params.managerId,
                arr: "clubs.manager"
            },
            arrayAction: ARR_PULL
        })
    )
);

// Add member
router.post(
    "/:id/member/:memberId",
    middleware,
    useHandlers(req =>
        updateArrayTemplate({
            club: {
                id: req.params.id,
                arr: "members"
            },
            user: {
                id: req.params.memberId,
                arr: "clubs.member"
            },
            arrayAction: ARR_PUSH
        })
    )
);

// Delete member
router.delete(
    "/:id/member/:memberId",
    middleware,
    useHandlers(req =>
        updateArrayTemplate({
            club: {
                id: req.params.id,
                arr: "members"
            },
            user: {
                id: req.params.memberId,
                arr: "clubs.member"
            },
            arrayAction: ARR_PULL
        })
    )
);

// Join group
router.post(
    "/:id/member",
    middleware,
    useHandlers(req =>
        updateArrayTemplate({
            club: {
                id: req.params.id,
                arr: "members"
            },
            user: {
                id: getUserId(req),
                arr: "clubs.member"
            },
            arrayAction: ARR_PUSH
        })
    )
);

// Leave group
router.delete(
    "/:id/member",
    middleware,
    useHandlers(req =>
        updateArrayTemplate({
            club: {
                id: req.params.id,
                arr: "members"
            },
            user: {
                id: getUserId(req),
                arr: "clubs.member"
            },
            arrayAction: ARR_PULL
        })
    )
);

// Delete club
router.delete(
    "/:id",
    middleware,
    useHandlers(req => ClubModel.findByIdAndDelete(req.params.id))
);

module.exports = router;
