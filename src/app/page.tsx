import { auth } from "@clerk/nextjs/server";
import PhotoHandlingWrapper from "./components/PhotoHandlingWrapper";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">

      <PhotoHandlingWrapper />
    </main>
  );
}
