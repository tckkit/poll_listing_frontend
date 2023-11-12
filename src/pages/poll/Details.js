import { useParams } from "react-router-dom";

export function Component() {
  const params = useParams();
  const pollId = params.pollId;
  return <div>Details {pollId}</div>;
}
