import { useEffect } from "react";
import Router from "next/router";
import Layout from "@/components/layout";

export default function Page({}) {
  useEffect(() => {
    Router.push("https://app.posthog.com/recordings/recent");
  }, []);

  return (
    <Layout>
      <p>Redirecting you to Posthog</p>
    </Layout>
  );
}
