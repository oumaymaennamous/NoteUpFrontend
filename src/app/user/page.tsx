"use client"; // This directive tells Next.js that this is a client component

import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const UserPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Your effect logic here
    console.log('User page mounted!');
  }, []); // This will run once after the initial render

  return <div>Welcome to the Professeur Page!</div>;
};

export default UserPage;
