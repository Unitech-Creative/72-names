import { ReactSVG } from "react-svg";
import Layout from "../components/layout";

export default function Home({ courses }) {
  return (
    <Layout>
      <div>
        <h1 className="text-4xl font-bold">SCAN</h1>

        <ScanChart />
      </div>
    </Layout>
  );
}

// export async function getStaticProps(context) {

//   return {
//     props: {  }, // will be passed to the page component as props
//   };
// }

function ScanChart() {
  const n = 16;

  return (
    // <div className="gap2-4 grid grid-cols-8">
    <div className="flex space-x-2">
      {Array.from({ length: n }, (_, index) => (
        <div className="col-span-1" key={index}>
          <EnergizingForce position={index + 1} />
        </div>
      ))}
    </div>
  );
}

function EnergizingForce({ position }) {
  return (
    <div className="relative aspect-square h-[100px] bg-sky-300 p-4 text-white">
      <div className="absolute bottom-0 right-0 h-1/2 w-full bg-black"></div>
      <ReactSVG
        src={`/images/svgs/72-${position}.svg`}
        className="absolute top-0 left-0 w-full fill-white"
      />
      <div className="text-red absolute bottom-0 right-0 text-sm">
        {position}
      </div>
    </div>
  );
}
