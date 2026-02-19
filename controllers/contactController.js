const asyncHandler = require("express-async-handler");
const prismaClient = require("../utils/prismaUtil");
const eventPublisher = require("../services/pubsub/publisher");

// private access only
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await prismaClient.contacts.findMany({
    where: {
      user_id: req.user.id,
    },
    orderBy: { id: "desc" },
    take: 15,
  });
  console.log("contacts records fetched from db via prisma orm:", contacts);

  res.status(200).json({
    message: "Records fetched successfully",
    status: "SUCCESS",
    records: contacts,
  });
});

// private access only
const createContact = asyncHandler(async (req, res) => {
  console.log("received payload is:", req.body);
  const { name, email, mobile } = req.body;
  if (!name || !email || !mobile) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }
  const user = req.user;

  const contact = await prismaClient.contacts.create({
    data: {
      name: name,
      email: email,
      mobile: mobile,
      user_id: user.id,
    },
  });

  await eventPublisher.publishEvent("CONTACT_CREATED", contact, user.email);
  console.log("[contactController]event published: CONTACT_CREATED");

  res.status(200).json({
    message: "contact recorded successfully",
    data: contact,
  });
});

// private access only
const getContactById = asyncHandler(async (req, res) => {
  console.log("req:", req.method, req.url, req.body);
  const contactId = Number(req.params.contactId);
  const contact = await prismaClient.contacts.findUnique({
    where: {
      id: contactId,
    },
  });

  res.status(200).json({
    message: "contact fetched successfully",
    data: contact,
  });
});

// private access only
const updateContactById = asyncHandler(async (req, res) => {
  console.log("[updateContactById]req:", req.method, req.url, req.body);

  const contact = await prismaClient.contacts.findFirst({
    where: {
      id: Number(req.params.contactId),
    },
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found with given id");
  }

  if (contact.user_id.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error("User dont have permission to update this contact");
  }

  const result = await prismaClient.contacts.update({
    where: {
      id: Number(req.params.contactId),
    },
    data: {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      updated_at: new Date(),
    },
  });

  console.log("[updateContactById]updatedContact:", result);

  const user = req.user;

  await eventPublisher.publishEvent("CONTACT_UPDATED", contact, user.email);
  console.log("[contactController]event published: CONTACT_UPDATED");

  res.status(200).json({
    message: "contact updated successfully",
    data: result,
  });
});

// private access only
const deleteContactById = asyncHandler(async (req, res) => {
  const contactId = Number(req.params.contactId);

  const contact = await prismaClient.contacts.findFirst({
    where: {
      id: contactId,
    },
  });

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found with given id");
  }

  if (contact.user_id.toString() !== req.user.id.toString()) {
    res.status(403);
    throw new Error("User dont have permission to delete this contact");
  }

  const result = await prismaClient.contacts.delete({
    where: {
      id: contactId,
    },
  });

  console.log("[deleteContactById] query result:", result);

  const user = req.user;

  await eventPublisher.publishEvent("CONTACT_DELETED", contact, user.email);
  console.log("[contactController]event published: CONTACT_DELETED");

  res.status(200).json({
    message: "Contact delete successful",
    data: result,
  });
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
};
