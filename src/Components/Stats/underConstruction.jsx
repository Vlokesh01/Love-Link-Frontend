import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../Home/comps/header.jsx";
import BottomNavbar from "../Home/comps/navbar.jsx";

/* 🎨 Shared Love Theme Colors */
const COLORS = {
  background: "linear-gradient(160deg, #FFE5EC 0%, #FFC2D1 100%)",
  textPrimary: "#FB6F92",
  textAccent: "#FFB3C6",
};

/* 💞 Floating Heart Animation */
const FloatingHeart = ({ delay }) => (
  <motion.div
    className="absolute opacity-20"
    initial={{ y: "100vh", x: Math.random() * 100 + "%" }}
    animate={{ y: "-10vh" }}
    transition={{ duration: 10, repeat: Infinity, delay, ease: "linear" }}
  >
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="text-pink-400"
      width={Math.random() * 20 + 10}
      height={Math.random() * 20 + 10}
      fill="currentColor"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
      4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
      14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
      6.86-8.55 11.54L12 21.35z" />
    </motion.svg>
  </motion.div>
);

/* 💌 Cute Emoji Doodle */
const Doodle = ({ emoji, delay }) => (
  <motion.span
    className="text-5xl"
    role="img"
    aria-label="emoji"
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      repeat: Infinity,
      duration: 3,
      ease: "easeInOut",
      delay,
    }}
  >
    {emoji}
  </motion.span>
);

/* 🏗️ Main Component */
export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden"
      style={{ background: COLORS.background }}
    >
      {/* 💫 Header */}
      <Header />

      {/* 💕 Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <FloatingHeart key={i} delay={i * 1.5} />
        ))}
      </div>

      {/* 💘 Center Content */}
      <motion.div
        className="text-center mt-28 px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 🧱 Emojis */}
        <div className="flex justify-center gap-4 mb-6">
          <Doodle emoji="🛠️" />
          <Doodle emoji="💞" delay={1} />
          <Doodle emoji="🚧" delay={0.5} />
        </div>

        {/* 🩷 Title */}
        <motion.h1
          className="text-4xl font-extrabold mb-3"
          style={{ color: COLORS.textPrimary }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          Page Under Construction 💕
        </motion.h1>

        {/* ✨ Message */}
        <p className="text-lg text-[#ffb3c6] mb-8">
          We're crafting something beautiful for you 💖  
          Please check back soon!
        </p>

        {/* 🩷 Back Home Button */}
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg"
        >
          ⬅️ Back to Home
        </motion.button>
      </motion.div>

      {/* 💗 Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
