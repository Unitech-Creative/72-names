import { Inngest } from "inngest";

const inngest = new Inngest({
  name: process.env.NEXT_PUBLIC_APP_NAME,
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export default inngest;
