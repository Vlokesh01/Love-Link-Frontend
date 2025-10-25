import React from "react";
import { motion } from "framer-motion";
import { FiHome, FiUser, FiSend } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const COLORS = {
  textPrimary: "#FB6F92",
  textAccent: "#FFB3C6",
};

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const bottomNav = [
    { name: "Home", icon: <FiHome />, path: "/" },
    { name: "Invite", icon: <FiSend />, path: "/invite" },
    { name: "Profile", icon: <FiUser />, path: "/profile" },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 bg-white/30 backdrop-blur-md border-t border-white/40 shadow-lg z-10"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
    >
      {bottomNav.map((nav, i) => {
        const isActive = location.pathname === nav.path;
        return (
          <motion.button
            key={i}
            onClick={() => navigate(nav.path)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center text-sm font-medium"
            style={{
              color: isActive ? COLORS.textPrimary : COLORS.textAccent,
            }}
          >
            <div
              className={`p-2 rounded-full ${
                isActive ? "bg-white/50" : "bg-transparent"
              }`}
            >
              {React.cloneElement(nav.icon, { size: 22 })}
            </div>
            <span className="mt-1">{nav.name}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
