import { MongoClient } from "mongodb";

export async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    return {
      statusCode: 500,
      body: { error: "Missing DATABASE_URL environment variable" },
    };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const inventory = await client
      .db("do-coffee")
      .collection("available-coffees")
      .find()
      .toArray();

    console.log("✅ Retrieved inventory:", inventory.length);
    return { statusCode: 200, body: inventory };
  } catch (error) {
    console.error("❌ Error retrieving coffee data:", error);
    return {
      statusCode: 400,
      body: { error: "There was a problem retrieving data." },
    };
  } finally {
    await client.close();
  }
}

