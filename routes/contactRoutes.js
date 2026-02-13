const express = require("express");
const contactRouter = express.Router();

const {
  getContacts,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

contactRouter.use(validateToken);
contactRouter.route("/").get(getContacts);
contactRouter.route("/").post(createContact);
contactRouter.route("/:contactId").get(getContactById);
contactRouter.route("/:contactId").put(updateContactById);
contactRouter.route("/:contactId").delete(deleteContactById);

module.exports = contactRouter;
