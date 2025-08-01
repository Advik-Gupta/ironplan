"use client";

import { useState } from "react";
import {
  signInAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "@/db/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/db/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      if (userCredential) {
        router.push("/");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocumentFromAuth(result.user);
      router.push("/");
    } catch (error: any) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Log In
        </button>
      </form>

      <div className="mt-2 text-center">
        <p className="text-gray-500 mb-2">or</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
