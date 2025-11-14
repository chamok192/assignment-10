import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../Provider/AuthContext";

import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Signup = () => {
  const { createUser, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const validatePassword = (value) => {
    const list = [];
    if (value.length < 6) list.push("Password must be at least 6 characters");
    if (!/[A-Z]/.test(value))
      list.push("Password must have an Uppercase letter");
    if (!/[a-z]/.test(value))
      list.push("Password must have a Lowercase letter");
    return list;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    const list = validatePassword(password);
    if (!name || !email || !password) list.unshift("Please fill all fields");
    if (list.length) {
      setErrors(list);
      return;
    }
    setErrors([]);

    try {
      await createUser(name, photo, email, password);

      setMessage("Registration successful");

      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      const msg = err?.message || "Registration failed";
      setErrors([msg]);

      toast.error(msg);
    }
  };

  const google = async () => {
    setErrors([]);

    setMessage("");

    try {
      await loginWithGoogle();

      setMessage("Login successful");

      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      const msg = err?.message || "Login failed";
      setErrors([msg]);

      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 my-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-15 h-15 rounded-xl bg-green-600 text-white">
              <span className="text-lg font-bold">PS</span>
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Create Account
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Join PlateShare to start helping others
            </p>
          </div>

          {message ? (
            <div className="mt-4 w-full rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2">
              {message}
            </div>
          ) : null}

          {errors.length ? (
            <div className="mt-4 w-full rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 space-y-1">
              {errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <input
                type="url"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                placeholder="https://example.com/photo.jpg"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                autoComplete="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Register
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={google}
              className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2 text-xl">
                {" "}
                <FcGoogle />{" "}
              </span>{" "}
              Login with Google
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-green-700 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By creating an account you agree to PlateShare’s Terms and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default Signup;
