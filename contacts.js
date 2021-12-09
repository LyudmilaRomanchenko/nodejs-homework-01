const fs = require("fs").promises;
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "db/contacts.json");
console.log(contactsPath);

// считываем список контактов
async function getContacts() {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

// обновляем список контактов
async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  const contacts = await getContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await getContacts();
  const result = contacts.find((contact) => Number(contact.id) === contactId);

  if (!result) {
    return null;
  }

  return result;
}

async function removeContact(contactId) {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    return null;
  }

  const remove = contacts.splice(contactIndex, 1);
  updateContacts(contacts);
  return remove;
}

async function addContact(name, email, phone) {
  const newContact = { name, email, phone, id: v4() };
  const contacts = await getContacts();
  contacts.push(newContact);

  updateContacts(contacts);

  // по правилам база данных должна возвращать новый созданый обьект
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
