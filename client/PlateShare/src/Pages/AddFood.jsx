import React, { useContext, useState } from "react";

import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../Provider/AuthContext";

import Container from "../components/Container";

import toast from "react-hot-toast";
import SpinnerSVG from "../components/SpinnerSVG";

function formatName(s) {
  if (!s) return "";
  return s
    .toString()
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function AddFood() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [foodName, setFoodName] = useState("");

  const [foodImage, setFoodImage] = useState("");

  const [foodImageFile, setFoodImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");

  const [expireDate, setExpireDate] = useState("");

  const [additionalNotes, setAdditionalNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function onFileChange(e) {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFoodImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  }

  function onUrlChange(e) {
    const value = e.target.value;
    setFoodImage(value);
    setImagePreview(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!user) {
      setError("You must be logged in to add food.");

      toast.error("You must be logged in to add food.");
      return;
    }

    if (
      !foodName.trim() ||
      !foodQuantity.trim() ||
      !pickupLocation.trim() ||
      !expireDate ||
      (!foodImage.trim() && !foodImageFile)
    ) {
      setError("Please fill in all required fields.");

      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      let imageForPayload = foodImage.trim();
      if (foodImageFile) {
        imageForPayload = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(foodImageFile);
        });
      }

      const payload = {
        foodName: foodName.trim(),

        foodImage: imageForPayload,
        foodQuantity: foodQuantity.trim(),

        pickupLocation: pickupLocation.trim(),

        expireDate: expireDate,

        additionalNotes: additionalNotes.trim(),

        donatorName: formatName(user.displayName || "Anonymous"),

        donatorEmail: user.email || "",

        donatorImage: user.photoURL || "",

        availability: "Available",

        food_status: "Available",

        createdAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:3000/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to add food.");
      }

      setMessage("Food added successfully!");
      toast.success("Food added successfully!");

      setFoodName("");

      setFoodImage("");

      setFoodImageFile(null);
      setImagePreview("");
      setFoodQuantity("");

      setPickupLocation("");

      setExpireDate("");

      setAdditionalNotes("");
      setTimeout(() => navigate("/available-foods"), 800);
    } catch (err) {
      const msg = err?.message || "Something went wrong while adding food.";
      setError(msg);

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto py-10">
          <div className="flex flex-col items-center">
            <SpinnerSVG
              size={56}
              strokeWidth={6}
              label="Checking authentication..."
            />

            <div className="mt-3 text-sm text-gray-600">
              Checking authentication...
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const donorNameDisplay = formatName(user.displayName || "Anonymous");

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Add Food</h1>
          <p className="text-gray-600 mt-2">
            Share your surplus food to help your community.
          </p>
        </div>

        {message ? (
          <div className="mb-6 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="mb-6 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        ) : null}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Donor Information
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || "https://via.placeholder.com/64x64?text=U"}
              alt="Donor avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-green-100"
            />
            <div>
              <p className="text-gray-900 font-medium">{donorNameDisplay}</p>
              <p className="text-gray-600 text-sm">{user?.email || ""}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Name
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Veggie Pasta"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Image
            </label>

            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-700 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload a file or provide an image URL.
                </p>
              </div>
              <div>
                <input
                  type="url"
                  value={foodImage}
                  onChange={onUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  One of file or URL is required.
                </p>
              </div>
            </div>
            {imagePreview ? (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Food preview"
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Quantity
            </label>
            <input
              type="text"
              value={foodQuantity}
              onChange={(e) => setFoodQuantity(e.target.value)}
              placeholder='e.g., "Serves 2 people"'
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g., 123 Main St, City"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expire Date
              </label>
              <input
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                min={today}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value="Available"
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                title="Default status"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              placeholder="e.g., Contains nuts, prepared today, keep refrigerated..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Add Food"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default AddFood;
