import { useEffect } from "react";
import Router from "next/router";
import Layout from "@/components/layout";

export default function Page({}) {
  useEffect(() => {
    Router.push(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL);
  }, []);

  return (
    <Layout>
      <p>Redirecting you to Sanity Studio</p>
    </Layout>
  );
}
