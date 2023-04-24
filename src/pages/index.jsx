import Layout from "../components/layout";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useCommands } from "../components/Command";

export default function Home({}) {

  const { open: commandsOpen, setOpen: setCommandsOpen, commandsDialog } = useCommands()



  return (
    <Layout>
      <Container>
        <Button
          onClick={() => setCommandsOpen(true)}
          className="sans-serif"
        >72</Button>
        {commandsDialog()}
      </Container>
    </Layout>
  );
}
