import { Salad } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-15 h-15 rounded-xl bg-green-600 text-white">
              <span className="text-lg font-bold">PS</span>
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">Login</h1>
            <p className="mt-1 text-sm text-gray-600">Sign in to your PlateShare account</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                placeholder=". . . . . . "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <span>Don't have an account? </span>
            <Link to="/signup" className="font-semibold text-green-700 hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing you agree to PlateShare’s Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
