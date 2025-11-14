import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence,motion } from "framer-motion";

const fallbackSlides = [
  {
    id: "community-table",
    foodName: "Community Kitchen",
    headline: "Share Food, Reduce Waste, Build Community",
    foodQuantity: "Meals for hundreds",
    foodImage:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "fresh-market",
    foodName: "Fresh Market Surplus",
    headline: "Fresh meals from generous donors",
    foodQuantity: "Boxes of produce",
    foodImage:
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=1600&q=80",
  },
];

const Banner = () => {
  const [slides, setSlides] = useState(fallbackSlides);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("http://localhost:3000/foods");
        if (!res.ok) throw new Error("Failed to load featured foods");
        const data = await res.json();
        if (!alive) return;
        const list = (Array.isArray(data) ? data : [])
          .filter((item) => String(item?.food_status || "").toLowerCase().includes("available"))
          .slice(0, 5)
          .map((item) => ({
            id: item?._id || item?.id,
            foodName: item?.foodName || "Featured Meal",
            headline: item?.additionalNotes || "Freshly prepared food ready to be shared",
            foodQuantity: item?.foodQuantity || "Generous portions",
            foodImage:
              item?.foodImage ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
          }));
        if (list.length) {
          setSlides(list);
          setActive(0);
        } else {
          setSlides(fallbackSlides);
        }
      } catch {
        if (alive) setSlides(fallbackSlides);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const currentSlide = useMemo(() => {
    if (!slides.length) return null;
    return slides[active % slides.length];
  }, [slides, active]);

  return (
    <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 mb-8">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {currentSlide ? (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={currentSlide.foodImage}
                alt={currentSlide.foodName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/20" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-12 text-white">
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-medium"
        >
        </motion.p>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl  md:text-4xl lg:text-5xl font-bold leading-snug mt-5 max-w-3xl"
        >
          PlateShare connects generous donors with communities that need nourishing meals.
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-base md:text-lg text-white/90 mt-4 max-w-2xl"
        >
          Discover surplus food nearby, coordinate pickups in minutes, and make every meal count for neighbors in need.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-green-700 px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
          >
            Search Food
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-xl font-semibold border border-white/60 text-white bg-white/10 backdrop-blur flex items-center justify-center gap-2 text-base"
          >
            Donate Food
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
            </svg>
          </motion.button>
        </div>

        <div className="flex gap-2 mt-12">
          {slides.map((slide, index) => (
            <button
              key={slide.id || index}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? "w-12 bg-white" : "w-6 bg-white/50"
              }`}
              aria-label={`Show ${slide.foodName}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
