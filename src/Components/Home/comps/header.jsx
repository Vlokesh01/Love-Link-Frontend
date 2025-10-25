import React from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const COLORS = {
  textPrimary: "#FB6F92",
};

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <motion.div
      className="w-full flex items-center justify-between px-4 py-3 fixed top-0 left-0 right-0 backdrop-blur-md bg-white/30 border-b border-white/40 shadow-md z-10"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
    >
      {/* 💞 Logo / App Title */}
      <h1
        className="text-2xl font-extrabold tracking-wide"
        style={{ color: COLORS.textPrimary }}
      >
        💞 Love Link
      </h1>

      {/* 🔒 Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full bg-white/30 border border-white/50 shadow-sm backdrop-blur-md"
        title="Log Out"
      >
        <FiLogOut size={22} color={COLORS.textPrimary} />
      </motion.button>
    </motion.div>
  );
}
