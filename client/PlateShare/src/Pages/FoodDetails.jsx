import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Container from "../components/Container";
import { AuthContext } from "../Provider/AuthContext";

function toTitleCase(s = "") {
  return String(s)
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const FoodDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [requestErr, setRequestErr] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr("");
        let data = null;
        try {
          const res = await fetch(`http://localhost:3000/foods/${id}`);
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // ignore error and proceed to fallback endpoints
          void 0;
        }
        if (!data || (Array.isArray(data) && data.length === 0)) {
          const res2 = await fetch(
            `http://localhost:3000/foods?id=${encodeURIComponent(id)}`,
          );
          if (res2.ok) {
            const d2 = await res2.json();
            data = Array.isArray(d2) ? d2[0] : d2;
          }
        }
        if (!data || (Array.isArray(data) && data.length === 0)) {
          const res3 = await fetch("http://localhost:3000/foods");
          if (res3.ok) {
            const list = await res3.json();
            if (Array.isArray(list)) {
              data =
                list.find((it) => `${id}` === `${it?._id}`) ??
                list.find((it) => `${id}` === `${it?.id}`);
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
    if (id) load();
    return () => {
      alive = false;
    };
  }, [id]);

  const isAvailable = useMemo(
    () =>
      String(food?.food_status || "")
        .toLowerCase()
        .includes("available"),

    [food],
  );

  async function handleRequest() {
    if (!user || !food?._id) return;
    setRequestMsg("");
    setRequestErr("");
    setRequesting(true);
    try {
      const payload = {
        foodId: food._id,
        requestedAt: new Date().toISOString(),
        requesterName: user.displayName || "",
        requesterEmail: user.email || "",
        status: "Pending",
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
      setRequestMsg("Request submitted! We'll notify the donor.");
    } catch (e) {
      setRequestErr(e?.message || "Could not submit request");
    } finally {
      setRequesting(false);
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
          <div className="text-center text-gray-600">
            Loading food details...
          </div>
        ) : err ? (
          <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">
            {err}
          </div>
        ) : !food ? (
          <div className="text-gray-600">Food not found.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={
                  food.foodImage ||
                  "https://via.placeholder.com/1200x500?text=Food+Image"
                }
                alt={food.foodName || "Food image"}
                className="w-full h-72 md:h-96 object-cover"
              />

              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {food.foodCategory || "Category"}
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
                  {food.availability || food.food_status || "Status"}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {food.foodName || "Food Item"}
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Quantity:{" "}
                    <span className="font-medium">
                      {food.foodQuantity || "N/A"}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-600">
                    Pickup Location:{" "}
                    <span className="font-medium">
                      {food.pickupLocation || "N/A"}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-600">
                    Expire Date:{" "}
                    <span className="font-medium">
                      {food.expireDate || "N/A"}
                    </span>
                  </p>
                </div>

                      <div className="`flex-shrink-0`">
                  <button
                    type="button"
                    onClick={handleRequest}
                    disabled={requesting || !isAvailable}
                    className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white ${
                      isAvailable
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    } disabled:opacity-60`}
                    title={isAvailable ? "Request this food" : "Not available"}
                  >
                    {requesting ? "Requesting..." : "Request Food"}
                  </button>
                  {requestMsg ? (
                    <div className="mt-3 rounded bg-green-50 text-green-700 text-sm px-3 py-2">
                      {requestMsg}
                    </div>
                  ) : null}
                  {requestErr ? (
                    <div className="mt-3 rounded bg-red-50 text-red-700 text-sm px-3 py-2">
                      {requestErr}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Additional Notes
                  </h2>
                  <div className="rounded-lg border border-gray-200 p-4 text-gray-700">
                    {food.additionalNotes || "No additional notes provided."}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Donator Info
                  </h2>
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                    <img
                      src={
                        food.donatorImage ||
                        "https://via.placeholder.com/64x64?text=U"
                      }
                      alt={food.donatorName || "Donor"}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-green-100"
                    />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {toTitleCase(food.donatorName || "Anonymous")}
                      </p>
                      {food.donatorEmail ? (
                        <p className="text-gray-600 text-sm">
                          {food.donatorEmail}
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
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FoodDetails;
