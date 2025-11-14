import React from "react";

import { useLoaderData, useNavigation } from "react-router-dom";

import FoodCard from "../components/FoodCard";

import Container from "../components/Container";
import SpinnerSVG from "../components/SpinnerSVG";

const AvailableFoods = () => {
  const data = useLoaderData();

  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  console.log("Loaded food data:", data);

  return (
    <Container>
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Available Foods
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover fresh food donations from your community. Help reduce waste
            and fight hunger together.
          </p>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <SpinnerSVG
              size={56}
              strokeWidth={6}
              label="Loading available foods..."
            />

            <div className="mt-3 text-sm text-gray-600">
              Loading available foods...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data

              .filter((foods) => foods.food_status === "Available")

              .map((foods) => (
                <FoodCard key={foods._id || foods.id} foods={foods} />
              ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default AvailableFoods;
