// client.js
import { createClient } from "@sanity/client";

export default createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // you can find this in sanity.json
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // or the name you chose in step 1
  apiVersion: "2022-12-12", // use a UTC date string
  useCdn: false, //process.env.NODE_ENV !== "development", // `false` if you want to ensure fresh data
  token: process.env.SANITY_API_TOKEN,
});
