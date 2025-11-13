import React from "react";
import { useLoaderData } from "react-router";
import FoodCard from "../components/FoodCard";
import Container from "../components/Container";

const AvailableFoods = () => {
  const data = useLoaderData();
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(foods=> <FoodCard key={foods.id} foods={foods} />)}
      </div>

      </div>
    </Container>
  );
};

export default AvailableFoods;
