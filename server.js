require("dotenv").config();
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const contactRouter = require("./routes/contactRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
