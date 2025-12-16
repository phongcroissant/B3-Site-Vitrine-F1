import { useParams } from "react-router-dom";

export default function RaceResult() {
  const circuitId = useParams();
  console.log(circuitId);

  return <div>RaceResult</div>;
}
