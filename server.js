const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
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


// model User {
//   id         Int        @id @default(autoincrement())
//   username   String     @db.VarChar(30)
//   email      String     @db.VarChar(50)
//   password   String     @db.VarChar(128)
//   created_at DateTime   @default(now()) @db.Timestamp(6)
//   updated_at DateTime   @default(now()) @db.Timestamp(6)

//   @@map("users")
// }

// users      users   @relation(fields: [user_id], references: [id], onDelete: NoAction, onUpdate: NoAction)