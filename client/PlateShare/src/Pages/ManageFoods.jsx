import React, { useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Container from "../components/Container";
import { AuthContext } from "../Provider/AuthContext";

const API_BASE = "http://localhost:3000";

function toISODate(value) {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function ManageFoods() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const location = useLocation();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    foodName: "",
    foodImage: "",
    foodCategory: "",
    foodQuantity: "",
    pickupLocation: "",
    expireDate: "",
    additionalNotes: "",
    food_status: "Available",
  });
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const userEmail = user?.email || "";

  const myFoods = useMemo(() => {
    if (!Array.isArray(foods)) return [];
    return foods.filter(
      (f) => (f?.donatorEmail || "").toLowerCase() === userEmail.toLowerCase(),
    );
  }, [foods, userEmail]);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/foods`);
        if (!res.ok) throw new Error("Failed to load foods");
        const data = await res.json();
        if (!alive) return;
        setFoods(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setErr(e?.message || "Something went wrong");
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (userEmail) load();
    return () => {
      alive = false;
    };
  }, [userEmail]);

  function openEditModal(food) {
    setEditId(food?.id ?? food?._id ?? null);
    setForm({
      foodName: food?.foodName || "",
      foodImage: food?.foodImage || "",
      foodCategory: food?.foodCategory || "",
      foodQuantity: food?.foodQuantity || "",
      pickupLocation: food?.pickupLocation || "",
      expireDate: toISODate(food?.expireDate),
      additionalNotes: food?.additionalNotes || "",
      food_status: food?.food_status || "Available",
    });
    setModalOpen(true);
    setActionMsg("");
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditId(null);
    setActionMsg("");
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function submitUpdate(e) {
    e.preventDefault();
    if (!editId) return;
    setSaving(true);
    setActionMsg("");

    try {
      const payload = {
        foodName: form.foodName.trim(),
        foodImage: form.foodImage.trim(),
        foodCategory: form.foodCategory.trim(),
        foodQuantity: form.foodQuantity.trim(),
        pickupLocation: form.pickupLocation.trim(),
        expireDate: form.expireDate,
        additionalNotes: form.additionalNotes.trim(),
        food_status: form.food_status.trim(),
      };

      const res = await fetch(
        `${API_BASE}/foods/${encodeURIComponent(editId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update");
      }

      setActionMsg("Food updated successfully.");
      setFoods((prev) =>
        prev.map((f) => {
          const fid = f?.id ?? f?._id;
          if (`${fid}` === `${editId}`) {
            return { ...f, ...payload };
          }
          return f;
        }),
      );
      setTimeout(() => {
        setSaving(false);
        closeModal();
      }, 600);
    } catch (e) {
      setSaving(false);
      setActionMsg(e?.message || "Update failed");
    }
  }

  async function handleDelete(food) {
    const targetId = food?.id ?? food?._id;
    if (!targetId) return;
    const yes = window.confirm("Are you sure you want to delete this food?");
    if (!yes) return;

    try {
      const res = await fetch(
        `${API_BASE}/foods/${encodeURIComponent(targetId)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete");
      }
      setFoods((prev) =>
        prev.filter((f) => `${f?.id ?? f?._id}` !== `${targetId}`),
      );
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  }

  if (authLoading) {
    return (
      <Container>
        <div className="max-w-5xl mx-auto py-10">
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

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage My Foods</h1>
          <p className="text-gray-600 mt-2">
            Foods added by: <span className="font-medium">{user?.email}</span>
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading your foods...</div>
        ) : err ? (
          <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">
            {err}
          </div>
        ) : myFoods.length === 0 ? (
          <div className="text-gray-600">
            You haven&apos;t added any foods yet.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expire Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myFoods.map((f) => (
                  <tr key={f?._id || f?.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            f?.foodImage ||
                            "https://via.placeholder.com/48x48?text=F"
                          }
                          alt={f?.foodName || "Food"}
                          className="w-12 h-12 rounded object-cover border"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {f?.foodName || "Food Item"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {f?.pickupLocation || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {f?.foodCategory || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {f?.foodQuantity || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {f?.expireDate || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          String(f?.food_status || "")
                            .toLowerCase()
                            .includes("available")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {f?.food_status || "Status"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(f)}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-600 text-white hover:bg-gray-700"
                          title="Update"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(f)}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeModal}
              aria-hidden="true"
            />
            <div className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Update Food
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Close
                </button>
              </div>

              <form onSubmit={submitUpdate} className="p-6 space-y-4">
                {actionMsg ? (
                  <div
                    className={`rounded-md px-3 py-2 text-sm ${
                      actionMsg.toLowerCase().includes("fail")
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {actionMsg}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Food Name
                    </label>
                    <input
                      type="text"
                      name="foodName"
                      value={form.foodName}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Food Image URL
                    </label>
                    <input
                      type="url"
                      name="foodImage"
                      value={form.foodImage}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="foodCategory"
                      value={form.foodCategory}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                    />
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
                      placeholder='e.g., "Serves 3 people"'
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
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
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expire Date
                    </label>
                    <input
                      type="date"
                      name="expireDate"
                      value={form.expireDate}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="food_status"
                      value={form.food_status}
                      onChange={onChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 bg-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Requested">Requested</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
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
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
}

export default ManageFoods;
