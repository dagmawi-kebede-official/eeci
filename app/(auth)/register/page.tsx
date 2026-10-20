"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password, name });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render the register form while auth is resolving or a redirect is in flight
  if (isLoading) return null;
  if (isAuthenticated) return null;

  return (
    <>
      <h2 className="card-title text-3xl pb-2 justify-center">Create Account</h2>
      <p className="text-center pb-2 text-white">
        Join to Assess, Manage, and Continuously Improve your Organization&apos;s Security.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Organization Name</span>
          </label>
          <input
            type="text"
            placeholder="Your organization name"
            className="input input-bordered w-full bg-white text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Organization Email</span>
          </label>
          <input
            type="email"
            placeholder="organization@company.com"
            className="input input-bordered w-full bg-white text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full bg-white text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full bg-white text-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <p className="text-center mt-4 pb-2 text-white">
            By creating an account, you agree to the Terms of Service.
          </p>
        </div>

        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn hover:text-white hover:bg-black hover:border-white text-black bg-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      <div className="divider text-white before:bg-white/30 after:bg-white/30 before:h-px after:h-px">OR</div>

      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="link text-white">
          Sign in
        </Link>
      </p>
    </>
  );
}
