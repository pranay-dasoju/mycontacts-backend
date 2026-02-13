const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/current_user", validateToken, currentUser);

module.exports = userRouter;
