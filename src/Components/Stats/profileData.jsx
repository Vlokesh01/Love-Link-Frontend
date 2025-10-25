import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../Home/comps/header";
import BottomNavbar from "../Home/comps/navbar";

const COLORS = {
  background: "linear-gradient(160deg, #FFE5EC 0%, #FFC2D1 100%)",
  glass: "rgba(255, 255, 255, 0.3)",
  border: "rgba(255, 255, 255, 0.5)",
  shadow: "rgba(251, 111, 146, 0.5)",
  textPrimary: "#FB6F92",
  textAccent: "#FFB3C6",
  buttonText: "#fff",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 20 },
  },
};

export default function UserDashboard() {
  const [data, setData] = useState({ user: null, partner: null });
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/users/details/${userId}`);
        setData({ user: res.data.user, partner: res.data.partner });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, baseUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffe5ec]">
        <span className="text-2xl font-bold text-[#fb6f92]">Loading...</span>
      </div>
    );
  }

  // ✅ Only include partner if exists
  const users = data.partner
    ? [
        { label: "You", info: data.user },
        { label: "Partner", info: data.partner },
      ]
    : [{ label: "You", info: data.user }];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-y-auto"
      style={{ background: COLORS.background }}
    >
      {/* Header */}
      <Header />

      {/* Animated Glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-10 left-10 w-52 h-52 rounded-full blur-[70px]"
          style={{ backgroundColor: "#FF8FAB" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-[80px]"
          style={{ backgroundColor: "#FFC2D1" }}
          animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Title */}
      <motion.div
        className="text-center mt-24 mb-10 px-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#fb6f92] drop-shadow-md">
           Your Love Profile 💞
        </h1>
        <p className="mt-2 text-lg text-[#ffb3c6]">
          {data.partner
            ? "Here’s you and your partner 💖"
            : "You don’t have a partner linked yet 💔"}
        </p>
      </motion.div>

      {/* User Cards */}
      <motion.div
        className={`grid gap-5 px-4 mb-24 ${
          data.partner ? "md:grid-cols-2 grid-cols-1" : "grid-cols-1"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {users.map((u, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded-3xl border border-white/50 shadow-xl backdrop-blur-md"
            style={{
              background: COLORS.glass,
              borderColor: COLORS.border,
              boxShadow: `0 8px 30px ${COLORS.shadow}`,
            }}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 12px 40px ${COLORS.shadow}`,
            }}
          >
            <h2 className="text-xl font-bold text-[#ff8fab] mb-2">
              {u.label}: {u.info.username}
            </h2>
            <p className="text-sm text-[#ffb3c6] mb-1">Email: {u.info.email}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <BottomNavbar />
    </div>
  );
}
