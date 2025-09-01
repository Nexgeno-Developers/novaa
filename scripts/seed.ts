import axios from "axios";

async function run() {
  const res = await axios.post("http://localhost:3000/api/cms/seed-default-data");
  console.log("✅ Seed result:", res.data);
}

run();