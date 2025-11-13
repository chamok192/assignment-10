import React from "react";
import Banner from "../components/Banner";
import HowItWorks from "../components/HowItWorks";
import FeaturedFoods from "../components/FeaturedFoods";
import OurImpact from "../components/OurImpact";
import OurMission from "../components/OurMission";

const Home = () => {
  return (
    <div>
      <Banner />
      <FeaturedFoods />
      <HowItWorks />
      <OurImpact />
      <OurMission />
    </div>
  );
};

export default Home;
