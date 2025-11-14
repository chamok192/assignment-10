import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SpinnerSVG from "./SpinnerSVG";

function FeaturedFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  function getNumberFromText(text) {
    const match = String(text || "").match(/\d+/);
    if (match) {
      return parseInt(match[0], 10) || 0;
    }
    return 0;
  }

  useEffect(() => {
    setLoading(true);
    setErr("");
    fetch("http://localhost:3000/foods")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load foods");
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const sorted = list
          .slice()
          .sort(
            (a, b) =>
              getNumberFromText(b?.foodQuantity) -
              getNumberFromText(a?.foodQuantity),
          )
          .slice(0, 6);
        setFoods(sorted);
      })
      .catch((e) => setErr(e?.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Foods</h2>
          <p className="text-gray-600 mt-2">
            Top 6 foods with the highest quantity
          </p>
        </div>

        {loading && (
          <div className="py-8 flex flex-col items-center justify-center">
            <SpinnerSVG
              size={48}
              strokeWidth={5}
              label="Loading featured foods..."
            />
            <div className="mt-2 text-sm text-gray-600">
              Loading featured foods...
            </div>
          </div>
        )}

        {!loading && err && (
          <div className="text-center text-red-600">{err}</div>
        )}

        {!loading && !err && foods.length === 0 && (
          <div className="text-center text-gray-600">
            No featured foods available right now.
          </div>
        )}

        {!loading && !err && foods.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((item, index) => (
                <div
                  key={item?._id || item?.id || index}
                  className="bg-white rounded-2xl shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={
                        item?.foodImage ||
                        "https://via.placeholder.com/600x300?text=Food"
                      }
                      alt={item?.foodName || "Food"}
                      className="w-full h-40 object-cover"
                    />

                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {item?.foodCategory || "Category"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          String(item?.food_status || "")
                            .toLowerCase()
                            .includes("available")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-400 text-red-800"
                        }`}
                      >
                        {item?.food_status || item?.availability || "Status"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {item?.foodName || "Food Item"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {item?.foodQuantity || "Serves 0 people"}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/foods/${item?.id || item?._id}`}
                        className="flex-1 bg-green-200 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-green-400 text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/available-foods"
                className="inline-block bg-green-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-700"
              >
                Show All
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedFoods;
