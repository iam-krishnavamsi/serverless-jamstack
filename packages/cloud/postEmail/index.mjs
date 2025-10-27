import { MongoClient } from "mongodb";

export async function main(args) {
  const uri = process.env.DATABASE_URL;
  console.log("Connecting to MongoDB with URI:", uri ? "Loaded" : "Missing");

  if (!uri) {
    return {
      statusCode: 500,
      body: { error: "Missing DATABASE_URL environment variable" },
    };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("do-coffee");
    const emailList = db.collection("email-list");

    const newEmail = args.email;
    if (!newEmail) {
      return { statusCode: 400, body: { error: "Email parameter is required." } };
    }

    await emailList.insertOne({ subscriber: newEmail, date: new Date() });

    console.log(`✅ Added ${newEmail} to database.`);
    return { statusCode: 200, body: { message: `Added ${newEmail}` } };
  } catch (error) {
    console.error("❌ Error adding email:", error);
    return {
      statusCode: 500,
      body: { error: "Failed to add email to database." },
    };
  } finally {
    await client.close();
  }
}

