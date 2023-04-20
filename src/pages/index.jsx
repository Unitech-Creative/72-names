import Layout from "../components/layout";

export default function Home({ courses }) {
  return (
    <Layout>
      <div className="">
        <h1 className="text-4xl font-bold">WELCOME</h1>
      </div>
    </Layout>
  );
}

// export async function getStaticProps(context) {

//   return {
//     props: {  }, // will be passed to the page component as props
//   };
// }
