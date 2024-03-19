"use client"

import Form from "@/components/Form";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';

export default function Home() {

  return (
    <div className="mx-auto px-4 py-8">
      <header className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-500">Code Vault</h1>
      </header>
      <Link href={"/submitted"} className="flex justify-center items-center mb-8">
        <p className="underline font-medium text-xl">View Submitted</p>
      </Link>
      <div className="gap-4 m-60 mt-4">
        <Form />
      </div>
    </div>
  );
}
