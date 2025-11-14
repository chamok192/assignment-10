import React, { useContext, useEffect, useMemo, useState } from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Container from "../components/Container";
import SpinnerSVG from "../components/SpinnerSVG";

import { AuthContext } from "../Provider/AuthContext";
import toast from "react-hot-toast";

function toTitleCase(s = "") {
  return String(s)
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizeId(value) {
  if (Array.isArray(value)) {
    const last = value[value.length - 1];
    if (last !== undefined && last !== null) {
      return String(last);
    }
    return value
      .filter((item) => item !== undefined && item !== null)
      .map((item) => String(item))
      .join(",");
  }
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
}

function matchesId(item, target) {
  if (!item || !target) return false;
  return (
    normalizeId(item.id) === target || normalizeId(item._id) === target
  );
}

const FoodDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedId = normalizeId(id);

  const [foods, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    location: "",
    reason: "",
    contact: "",
  });
  const [savingRequest, setSavingRequest] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsErr, setRequestsErr] = useState("");
  const [updatingRequestId, setUpdatingRequestId] = useState(null);

  useEffect(() => {
    let alive = true;
    setFood(null);
    setErr("");
    setLoading(true);
    async function load() {
      try {
        let data = null;
        if (normalizedId) {
          try {
            const res = await fetch(
              `http://localhost:3000/foods/${encodeURIComponent(normalizedId)}`,
            );
            if (res.ok) {
              const payload = await res.json();
              if (Array.isArray(payload)) {
                data = payload.find((item) => matchesId(item, normalizedId)) || null;
              } else if (matchesId(payload, normalizedId)) {
                data = payload;
              }
            }
          } catch {
           
            void 0;
          }
        }
        if (!data) {
          const res2 = await fetch(
            `http://localhost:3000/foods?id=${encodeURIComponent(normalizedId)}`,
          );
          if (res2.ok) {
            const d2 = await res2.json();
            if (Array.isArray(d2)) {
              data = d2.find((item) => matchesId(item, normalizedId)) || null;
            } else if (matchesId(d2, normalizedId)) {
              data = d2;
            }
          }
        }
        if (!data) {
          const res3 = await fetch("http://localhost:3000/foods");
          if (res3.ok) {
            const list = await res3.json();
            if (Array.isArray(list)) {
              data = list.find((it) => matchesId(it, normalizedId)) || null;
            }
          }
        }
        if (!alive) return;
        if (!data) {
          throw new Error("Failed to load food details");
        }
        setFood(data || null);
      } catch (e) {
        if (alive) setErr(e?.message || "Something went wrong");
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (normalizedId) {
      load();
    } else {
      setLoading(false);
    }
    return () => {
      alive = false;
    };
  }, [normalizedId]);

  const isAvailable = useMemo(
    ()=> 
      String(foods?.food_status || "")
        .toLowerCase()
        .includes("available"),

    [foods?.food_status],
  );

  const isOwner = useMemo(() => {
    if (!foods?.donatorEmail || !user?.email) return false;
    return foods.donatorEmail.toLowerCase() === user.email.toLowerCase();
  }, [foods?.donatorEmail, user?.email]);

  useEffect(() => {
    if (!isOwner || !foods?._id) {
      setRequests([]);
      setRequestsErr("");
      return;
    }
    let alive = true;
    setRequestsLoading(true);
    setRequestsErr("");
    async function loadRequests() {
      try {
        const res = await fetch(
          `http://localhost:3000/requests?foodId=${encodeURIComponent(foods._id)}`,
        );
        if (!res.ok) throw new Error("Failed to load requests");
        const data = await res.json();
        if (!alive) return;
        setRequests(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setRequestsErr(e?.message || "Failed to load requests");
      } finally {
        if (alive) setRequestsLoading(false);
      }
    }
    loadRequests();
    return () => {
      alive = false;
    };
  }, [isOwner, foods?._id]);

  function openRequestModal() {
    if (!isAvailable) return;
    setRequestModalOpen(true);
  }

  function closeRequestModal() {
    if (savingRequest) return;
    setRequestModalOpen(false);
    setRequestForm({ location: "", reason: "", contact: "" });
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitFoodRequest(e) {
    e.preventDefault();
    if (!user || !foods?._id || savingRequest) return;
    const location = requestForm.location.trim();
    const reason = requestForm.reason.trim();
    const contact = requestForm.contact.trim();
    if (!location || !reason || !contact) {
      toast.error("Please fill in all request fields.");
      return;
    }
    toast.dismiss();
    setSavingRequest(true);
    try {
      const payload = {
        foodId: foods._id,
        requestedAt: new Date().toISOString(),
        requesterName: user.displayName || "",
        requesterEmail: user.email || "",
        requesterPhoto: user.photoURL || "",
        location,
        reason,
        contact,
        status: "pending",
        foodOwnerEmail: foods.donatorEmail || "",
      };
      const res = await fetch("http://localhost:3000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to request food");
      }
      toast.success("Request submitted! We'll notify the donor.");
      closeRequestModal();
    } catch (e) {
      toast.error(e?.message || "Could not submit request");
    } finally {
      setSavingRequest(false);
    }
  }

  async function handleRequestStatus(item, nextStatus) {
    if (!item) return;
    const targetId = item?._id || item?.id;
    if (!targetId) return;
    setUpdatingRequestId(targetId);
    try {
      const res = await fetch(
        `http://localhost:3000/requests/${encodeURIComponent(targetId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update request");
      }
      setRequests((prev) =>
        prev.map((req) => {
          const rid = req?._id || req?.id;
          if (`${rid}` === `${targetId}`) {
            return { ...req, status: nextStatus };
          }
          return req;
        }),
      );
      if (nextStatus === "accepted" && foods?._id) {
        const resFood = await fetch(
          `http://localhost:3000/foods/${encodeURIComponent(foods._id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ food_status: "Donated", availability: "Donated" }),
          },
        );
        if (!resFood.ok) {
          const data = await resFood.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to update food status");
        }
        setFood((prev) =>
          prev ? { ...prev, food_status: "Donated", availability: "Donated" } : prev,
        );
      }
      if (nextStatus === "rejected" && foods?.food_status === "Donated") {
        setFood((prev) => prev);
      }
    } catch (e) {
      toast.error(e?.message || "Unable to update request");
    } finally {
      setUpdatingRequestId(null);
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
      <div className="max-w-5xl mx-auto py-10">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <SpinnerSVG size={56} label="Loading food details..." />
          </div>
        ) : err ? (
          <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">
            {err}
          </div>
        ) : !foods ? (
          <div className="text-gray-600">Food not found.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={
                  foods.foodImage ||
                  "https://via.placeholder.com/1200x500?text=Food+Image"
                }
                alt={foods.foodName || "Food image"}
                className="w-full h-72 md:h-96 object-cover"
              />

              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {foods.foodCategory || "Category"}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-400 text-red-800"
                  }`}
                >
                  {foods.availability || foods.food_status || "Status"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {foods.foodName || "Food Item"}
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Quantity:{" "}
                    <span className="font-medium">
                      {foods.foodQuantity || "N/A"}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-600">
                    Pickup Location:{" "}
                    <span className="font-medium">
                      {foods.pickupLocation || "N/A"}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-600">
                    Expire Date:{" "}
                    <span className="font-medium">
                      {foods.expireDate || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="`flex-shrink-0`">
                  <button
                    type="button"
                    onClick={openRequestModal}
                    disabled={!isAvailable}
                    className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white ${
                      isAvailable
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    } disabled:opacity-60`}
                    title={isAvailable ? "Request this food" : "Not available"}
                  >
                    Request Food
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Additional Notes
                  </h2>
                  <div className="rounded-lg border border-gray-200 p-4 text-gray-700">
                    {foods.additionalNotes || "No additional notes provided."}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Donator Info
                  </h2>
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                    <img
                      src={
                        foods.donatorImage ||
                        "https://via.placeholder.com/64x64?text=U"
                      }
                      alt={foods.donatorName || "Donor"}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-green-100"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {toTitleCase(foods.donatorName || "Anonymous")}
                      </p>
                      {foods.donatorEmail ? (
                        <p className="text-gray-600 text-sm">
                          {foods.donatorEmail}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center rounded-lg bg-green-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-400"
                >
                  Go Back
                </button>
              </div>
              {isOwner ? (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Food Requests
                  </h3>
                  {requestsLoading ? (
                    <div className="py-6 text-sm text-gray-600">Loading requests...</div>
                  ) : requestsErr ? (
                    <div className="rounded-md bg-red-50 text-red-700 text-sm px-4 py-3">
                      {requestsErr}
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No requests submitted for this food yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Requester</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Location</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Reason</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Contact</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {requests.map((req) => {
                            const rid = req?._id || req?.id;
                            const statusLabel = toTitleCase(req?.status || "pending");
                            const locked =
                              String(req?.status || "")
                                .toLowerCase()
                                .includes("accepted") ||
                              String(req?.status || "")
                                .toLowerCase()
                                .includes("rejected");
                            return (
                              <tr key={rid || Math.random()}>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        req?.requesterPhoto ||
                                        "https://via.placeholder.com/32x32?text=U"
                                      }
                                      alt={req?.requesterName || "Requester"}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {req?.requesterName || "Anonymous"}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {req?.requesterEmail || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">{req?.location || "-"}</td>
                                <td className="px-4 py-3 text-gray-700">
                                  <span className="line-clamp-2">{req?.reason || "-"}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-700">{req?.contact || "-"}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      String(req?.status || "")
                                        .toLowerCase()
                                        .includes("accepted")
                                        ? "bg-green-100 text-green-800"
                                        : String(req?.status || "")
                                            .toLowerCase()
                                            .includes("rejected")
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {statusLabel}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="inline-flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleRequestStatus(req, "accepted")}
                                      disabled={
                                        locked || updatingRequestId === rid || foods?.food_status === "Donated"
                                      }
                                      className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-600 text-white disabled:opacity-50"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRequestStatus(req, "rejected")}
                                      disabled={locked || updatingRequestId === rid}
                                      className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-500 text-white disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {requestModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeRequestModal}
            aria-hidden="true"
          />
          <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-xl border border-gray-200 z-50">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Request Food</h3>
              <button
                type="button"
                onClick={closeRequestModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitFoodRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={requestForm.location}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter where you can receive the food"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Why do you need this food?
                </label>
                <textarea
                  name="reason"
                  value={requestForm.reason}
                  onChange={handleFormChange}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Share a short message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={requestForm.contact}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. +8801XXXXXXX"
                />
              </div>
              <button
                type="submit"
                disabled={savingRequest}
                className="w-full rounded-lg bg-green-600 text-white font-semibold py-2.5 hover:bg-green-700 disabled:opacity-60"
              >
                {savingRequest ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </Container>
  );
};

export default FoodDetails;
