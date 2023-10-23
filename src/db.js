const { MongoClient } = require("mongodb");

async function run() {
  const uri =
    "mongodb+srv://blihmarketing:blihmarketing1!@cluster0.fxwjcvu.mongodb.net/";
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "telegrambot";
  const collectionName = "users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const users = [
    {
      user_id: "12345",
      first_name: "John",
      last_name: "Doe",
      phone_number: "+1234567890",
      email: "johndoe@example.com",
      birth_date: "1990-01-01",
      company_name: "ABC Inc.",
    },
    {
      user_id: "67890",
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "+0987654321",
      email: "janedoe@example.com",
      birth_date: "1995-05-05",
      company_name: "XYZ Corp.",
    },
  ];

  try {
    const insertManyResult = await collection.insertMany(users);
    console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }

  // Existing code...

  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}

run().catch(console.dir);