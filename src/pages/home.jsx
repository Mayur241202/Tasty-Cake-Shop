import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-pink-100 flex flex-col">
      <Header/>

      <div className="flex flex-col items-center gap-10 p-10 text-center w-full max-w-5xl mx-auto">
        {/* Hero Text */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-800 font-cursive leading-snug">
            Welcome to
          </h1>
          <div className="inline-block mt-2">
            <span className="bg-pink-500 text-white px-4 py-2 rounded-md text-4xl sm:text-5xl font-extrabold font-cursive block">
              Tasty Cake & Bakers
            </span>
          </div>
          <h2 className="text-xl font-semibold text-pink-500 mt-4">
            “If you eat once, you will come back.”
          </h2>
          <p className="text-lg text-gray-700 mt-6 leading-relaxed max-w-xl mx-auto">
            Serving love in every slice – whether it's a cupcake, cake, or cookie, our sweet treats are crafted to steal your heart.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
          >
            Order Now 🍰
          </button>
        </div>

        {/* Logo Section */}
        <div className="max-w-xs">
          <img
            src={logo}
            alt="Tasty Cake Logo"
            loading="lazy"
            className="w-full rounded-2xl border-4 border-pink-200 shadow-xl"
          />
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white rounded-t-[2rem] shadow-inner px-6 py-12 mt-auto">
        <h2 className="text-3xl font-bold text-pink-500 text-center mb-10">Why Choose Us?</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {[
            { title: "Freshly Baked", desc: "Every item is baked fresh daily with love and premium ingredients." },
            { title: "Delight in Variety", desc: "From creamy cupcakes to crunchy cookies, we have it all!" },
            { title: "Made with Love", desc: "Each dessert is handcrafted with passion and care." },
            { title: "Customer Favorite", desc: "Our customers keep coming back – just like the slogan says!" }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-pink-50 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-bold text-pink-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
