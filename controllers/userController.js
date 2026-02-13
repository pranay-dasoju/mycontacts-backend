const asyncHandler = require("express-async-handler");
const prismaClient = require("../utils/prismaUtil");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// public access
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  if (await isExistingUser(email)) {
    res.status(400);
    throw new Error("User already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed password:", hashedPassword);

  const user = await prismaClient.users.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });

  if (user) {
    res.status(200).json({
      message: "user registered successfully",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

async function isExistingUser(email) {
  const user = await prismaClient.users.findFirst({
    where: {
      email: email,
    },
  });

  return user;
}

// public access
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await prismaClient.users.findFirst({
    where: {
      email: email,
    },
  });

  console.log("---log 1---, user:", user);

  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("---log 2---");
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      },
    );
    res.status(200).json({
      accessToken: accessToken,
    });
  } else {
    console.log("---log 3---");
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// private access only
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
