'use client'

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Login from "../login/page";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged] = useState(() => {
    if (typeof window !== "undefined") {
      const username = localStorage.getItem('username');
      return !!username;
    }
    return false;
  });

  return (
    <div className="flex h-screen w-full bg-[#0f081a] text-gray-100 overflow-hidden">
      {isLogged ? (
        <>
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}