// components/LoginPopup.jsx
"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";

export default function LoginPopup({ isOpen, onClose }) {
  const { data: session } = useSession();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[#202232] border border-[#414670] p-6 rounded-xl w-full max-w-sm space-y-4 text-white">
          <Dialog.Title className="text-xl font-bold">Connect to ctScreener</Dialog.Title>
          {session ? (
            <div className="space-y-3">
              <p className="text-sm">Twitter: {session.user.name}</p>
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={() => signIn("twitter")}
            >
              Login with Twitter
            </button>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

