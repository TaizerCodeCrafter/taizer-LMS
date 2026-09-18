import React from "react";

export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 shadow-md bg-white">
        <h1 className="text-xl font-bold text-blue-600">EconMaster LK</h1>
        <div className="space-x-4">
          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="text-center py-16 bg-blue-100">
        <h2 className="text-4xl font-bold mb-4">
          Economics Classes Grade 6 - A/L
        </h2>
        <p className="mb-6">සරලව Economics ඉගෙන ගමු</p>
        <button className="bg-yellow-400 px-6 py-2 rounded-xl font-semibold">
          Join Now
        </button>
      </section>

      {/* About */}
      <section id="about" className="p-8">
        <h2 className="text-2xl font-bold mb-4">About Teacher</h2>
        <p>
          Qualified Economics graduate with experience teaching students from
          Grade 6 to A/L with simple explanations and exam focus.
        </p>
      </section>

      {/* Courses */}
      <section id="courses" className="p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Courses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-white shadow rounded-2xl">
            <h3 className="font-bold text-lg">Grade 6-9</h3>
            <p>Foundation level Economics</p>
          </div>
          <div className="p-4 bg-white shadow rounded-2xl">
            <h3 className="font-bold text-lg">O/L</h3>
            <p>Exam-focused Economics</p>
          </div>
          <div className="p-4 bg-white shadow rounded-2xl">
            <h3 className="font-bold text-lg">A/L</h3>
            <p>Advanced theory & past papers</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p>WhatsApp: 07XXXXXXXX</p>
        <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl">
          Chat on WhatsApp
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-800 text-white">
        © 2026 EconMaster LK
      </footer>
    </div>
  );
}
