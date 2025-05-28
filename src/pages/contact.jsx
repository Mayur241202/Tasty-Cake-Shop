import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      phone: formData.countryCode + formData.mobile,
    };

    try {
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          countryCode: "+91",
          message: "",
        });
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="bg-[#f1c197] min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">Contact Tasty Cake Shop</h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Mobile No.</label>
                <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-3 py-2 bg-gray-100 border-r rounded-l-lg focus:outline-none"
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+81">+81 (JP)</option>
                  </select>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                    className="w-full px-4 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Your Message"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Our Shop</h3>
              <p className="text-gray-600 mt-2">123 Cake Street, Dessert City, Sweetland</p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
              <p className="text-gray-600 mt-2">+1 234 567 890</p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600 mt-2">contact@tastycakeshop.com</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
