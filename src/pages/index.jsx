import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useCommands } from "@/components/Command";
import { Logo } from "../components/Logo";

export default function Home({}) {



  return (
    <Layout>
      <Container>
        <Logo />
      </Container>
    </Layout>
  );
}
