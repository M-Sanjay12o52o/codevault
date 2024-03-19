import Image from "next/image";
import Form from "./components/Form";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome Home</h1>
      <Form />
      <br />
      <br />
      <Link href={"/submitted"}>View Submitted</Link>
    </div>
  );
}
