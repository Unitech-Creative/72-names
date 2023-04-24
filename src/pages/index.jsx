import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { Logo } from "../components/Logo";
import { Names } from "@/components/ScrollingNames";

export default function Home({}) {



  return (
    <Layout>
      <Container>
        <Names />
      </Container>
    </Layout>
  );
}
