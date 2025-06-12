import clientPromise from "../lib/mongodb";

export async function getLatestCompletedJobByKeyword(keyword) {
  const client = await clientPromise;
  const db = client.db("tw_store");
  const jobs = db.collection("jobs");

  const doc = await jobs.findOne(
    { type: "search", keyword, status: "completed" },
    { sort: { created_at: -1 } },
  );

  return doc;
}
