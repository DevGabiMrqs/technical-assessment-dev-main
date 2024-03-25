import express from "express";
import { UserModel } from "./models";
import {
  createUser,
  deleteUser,
  getUsers,
  getUsersById,
  updateUser,
} from "./controllers/user.controller";
import {
  createRegion,
  deleteRegion,
  getRegionById,
  getRegions,
  updateRegion,
} from "./controllers/region.controller";

const server = express();
const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUsersById);
router.put("/users/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.post("/regions", createRegion);
router.get("/regions/", getRegions);
router.get("/regions/:id", getRegionById);
router.put("/regions/:id", updateRegion);
router.delete("/regions/:id", deleteRegion);

const STATUS = {
  OK: 200,
  CREATED: 201,
  UPDATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  DEFAULT_ERROR: 418,
};

router.get("/users", async (req, res) => {
  const { page, limit } = req.query;

  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.countDocuments(),
  ]);

  return res.json({
    rows: users,
    page,
    limit,
    total,
  });
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    return res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
  }

  return res.json(user);
});

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { update } = req.body;

  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    return res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
  }

  user.name = update.name;

  await user.save();

  return res.sendStatus(STATUS.UPDATED);
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
    }
    return res.sendStatus(STATUS.OK);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
});

server.use(express.json());
server.use(router);

export default server;
