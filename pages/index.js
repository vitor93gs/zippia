import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/test/jobs");
  }, []);

  return <div>Redirecting to /test/jobs...</div>;
}
