const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  updateContact,
  addContact,
} = require("../../models/contacts");

const Joi = require("joi");

const { updateStatusContact } = require("../../services/db-services/services");
const { protect } = require("../../middlewares/contactMiddlewares");
const addSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  owner: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
  owner: Joi.string(),
}).min(1);

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const favoriteFilter = req.query.favorite === "true";
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 5;
    const contactList = await listContacts(req.owner, favoriteFilter, {
      page,
      limit,
    });
    res.status(200).json({ contactList });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const ownerId = req.owner;
    const searchContact = await getContactById(contactId, ownerId);
    if (!searchContact) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    if (searchContact.owner.toString() !== ownerId) {
      res.status(403).json({ msg: "Not allowed" });
      return;
    }
    searchContact
      ? res.status(200).json({ searchContact })
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, async (req, res, next) => {
  try {
    const validation = addSchema.validate(req.body);
    if (validation.error) {
      const missingField = validation.error.message.split('"')[1];
      console.log(validation.error.message);
      res
        .status(400)
        .json({ message: `missing required ${missingField} field` });
    } else {
      const newContact = await addContact(req.body);
      res.status(201).json({ newContact });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", protect, async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    (await removeContact(contactId))
      ? res.status(200).json({ message: "contact deleted" })
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", protect, async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const validation = updateSchema.validate(req.body);
    if (validation.error) {
      res.status(400).json({ message: "missing fields" });
      return;
    }
    const updatedContact = await updateContact(contactId, req.body);
    Object.keys(updatedContact).length > 0
      ? res.status(200).json({ updatedContact })
      : res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", protect, async (req, res, next) => {
  const contactId = req.params.contactId;
  if (typeof req.body.favorite === "boolean") {
    const favoriteContact = await updateStatusContact(contactId, req.body);

    favoriteContact
      ? res.status(200).json({ data: favoriteContact })
      : res.status(404).json({ message: "Not found" });
  } else {
    res.status(400).json({ message: "missing field favorite" });
  }
});

module.exports = router;
