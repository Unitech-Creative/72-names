import { useEffect } from "react";
import Router from "next/router";
import Layout from "@/components/layout";

export default function Page({}) {
  useEffect(() => {
    Router.push(process.env.NEXT_PUBLIC_VERCEL_URL);
  }, []);

  return (
    <Layout>
      <p>Redirecting you to Vercel</p>
    </Layout>
  );
}
