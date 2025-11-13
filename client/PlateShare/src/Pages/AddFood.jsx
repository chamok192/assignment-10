import React, { useContext, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthContext";
import Container from "../components/Container";

const toTitleCase = (s = "") =>
  s
    .toString()
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const AddFood = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    foodName: "",
    foodImage: "",
    foodImageFile: null,
    foodQuantity: "",
    pickupLocation: "",
    expireDate: "",
    additionalNotes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foodImageFile") {
      const file = files && files[0] ? files[0] : null;
      setForm((s) => ({ ...s, foodImageFile: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
      } else {
        setImagePreview("");
      }
      return;
    }
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "foodImage") {
      setImagePreview(value || "");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!user) {
      setError("You must be logged in to add food.");
      return;
    }
    if (!form.foodImage.trim() && !form.foodImageFile) {
      setError("Provide an image URL or upload a file.");
      return;
    }
    setSubmitting(true);
    try {
      const donorName = toTitleCase(user.displayName || "Anonymous");
      let imageForPayload = form.foodImage.trim();
      if (form.foodImageFile) {
        imageForPayload = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(form.foodImageFile);
        });
      }
      const payload = {
        foodName: form.foodName.trim(),
        foodImage: imageForPayload,
        foodQuantity: form.foodQuantity.trim(),
        pickupLocation: form.pickupLocation.trim(),
        expireDate: form.expireDate,
        additionalNotes: form.additionalNotes.trim(),
        donatorName: donorName,
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
      setForm({
        foodName: "",
        foodImage: "",
        foodImageFile: null,
        foodQuantity: "",
        pickupLocation: "",
        expireDate: "",
        additionalNotes: "",
      });
      setImagePreview("");
      setTimeout(() => navigate("/available-foods"), 800);
    } catch (err) {
      setError(err?.message || "Something went wrong while adding food.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto py-10">
          <div className="text-center text-sm text-gray-600">
            Checking authentication...
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const donorNameDisplay = toTitleCase(user.displayName || "Anonymous");

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
          onSubmit={submit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Name
            </label>
            <input
              type="text"
              name="foodName"
              value={form.foodName}
              onChange={onChange}
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
                  name="foodImageFile"
                  accept="image/*"
                  onChange={onChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-700 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload a file or provide an image URL.
                </p>
              </div>
              <div>
                <input
                  type="url"
                  name="foodImage"
                  value={form.foodImage}
                  onChange={onChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  One of file or URL is required.
                </p>
              </div>
            </div>
            {(imagePreview || form.foodImage) && (
              <div className="mt-3">
                <img
                  src={imagePreview || form.foodImage}
                  alt="Food preview"
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Quantity
            </label>
            <input
              type="text"
              name="foodQuantity"
              value={form.foodQuantity}
              onChange={onChange}
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
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={onChange}
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
                name="expireDate"
                value={form.expireDate}
                onChange={onChange}
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
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={onChange}
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
};

export default AddFood;
