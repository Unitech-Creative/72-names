import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { ScrollingNames } from "@/components/ScrollingNames";

export default function Home({}) {
  return (
    <Layout>
      <Container className='w-full'>
        <ScrollingNames />
      </Container>
    </Layout>
  );
}
