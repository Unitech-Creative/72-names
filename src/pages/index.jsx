import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { Logo } from "../components/Logo";
import { Reviews } from '@/components/Reviews'

export default function Home({}) {



  return (
    <Layout>
      <div className="bg-cal-300">
        <Reviews />
      </div>
    </Layout>
  );
}
