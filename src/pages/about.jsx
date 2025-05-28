import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const About = () => {
  const [topCakes, setTopCakes] = useState([]);

  useEffect(() => {
    // Fetch top cakes from backend
    fetch("http://localhost:8000/api/cakes?limit=3")
      .then((res) => res.json())
      .then((data) => setTopCakes(data))
      .catch((err) => console.error("Failed to fetch cakes", err));
  }, []);

  return (
    <div className="bg-[#bfa188] min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* About Us Section */}
      <section className="flex-1 container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">About Tasty Cake Shop</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Welcome to <strong>Tasty Cake Shop</strong>, where we bake the freshest and most delicious cakes to
          satisfy your cravings. Whether it's for a celebration or just a treat, we have something sweet for
          everyone.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our mission is to provide the highest quality cakes made with love and the finest ingredients. We aim
            to bring joy to every occasion with our wide variety of mouth-watering cakes.
          </p>
        </div>
      </section>

      {/* Our Best Cakes Section */}
      <section className="py-16 container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Best Cakes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {topCakes.map((cake) => (
            <div key={cake._id} className="bg-white shadow-lg rounded-lg p-6">
              <img
                src={cake.imageUrl}
                alt={cake.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{cake.name}</h3>
              <p className="text-gray-600">{cake.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
