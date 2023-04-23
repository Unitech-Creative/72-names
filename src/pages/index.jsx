import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import {CommandDemo} from "../components/Command";

export default function Home({ courses }) {
  return (
    <Layout>
      <Container>
        <CommandDemo />
      </Container>
    </Layout>
  );
}
