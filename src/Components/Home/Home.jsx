import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./comps/header";
import BottomNavbar from "./comps/navbar";

const COLORS = {
  background: "linear-gradient(160deg, #FFE5EC 0%, #FFC2D1 100%)",
  glass: "rgba(255, 255, 255, 0.3)",
  border: "rgba(255, 255, 255, 0.5)",
  shadow: "rgba(251, 111, 146, 0.5)",
  textPrimary: "#FB6F92",
  textAccent: "#FFB3C6",
  buttonText: "#fff",
  primaryGlow: "#FF8FAB",
  secondaryGlow: "#FFC2D1",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 20 },
  },
};

export default function Home() {
  const navigate = useNavigate();

  const user = React.useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : { username: "Partner" };
    } catch {
      return { username: "Partner" };
    }
  }, []);

  const interactionButtons = [
    { label: "Miss Youu", emoji: "🥺", path: "/missyou" },
    { label: "Love Youu", emoji: "💖", path: "/underconstruction" },
    { label: "Send Hugs", emoji: "🤗", path: "/underconstruction" },
    { label: "Send Kisses", emoji: "😘", path: "/underconstruction" },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start px-4 py-10 relative overflow-hidden"
      style={{ background: COLORS.background }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 🔝 Header */}
      <Header />

      {/* Glowing Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-10 left-10 w-52 h-52 rounded-full blur-[70px]"
          style={{ backgroundColor: COLORS.primaryGlow }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.5, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-[80px]"
          style={{ backgroundColor: COLORS.secondaryGlow }}
          animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* 💖 Header Text */}
      <motion.div
        className="text-center mb-16 mt-24 p-4 bg-white/30 rounded-xl backdrop-blur-md border border-white/50"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
      >
        <h2
          className="text-3xl font-extrabold drop-shadow-md"
          style={{ color: COLORS.textPrimary }}
        >
          💖 Welcome {user?.username}
        </h2>
        <p
          className="mt-2 text-lg font-medium drop-shadow-sm"
          style={{ color: COLORS.textAccent }}
        >
          Show affection to your love ! 
        </p>
      </motion.div>

      {/* 2x2 Grid */}
      <motion.div
        className="grid grid-cols-2 gap-5 w-full max-w-xs sm:max-w-sm mb-24"
        variants={containerVariants}
      >
        {interactionButtons.map((btn, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(btn.path)}
            className="flex flex-col items-center justify-center aspect-square rounded-3xl p-5 border cursor-pointer transition duration-300"
            style={{
              background: COLORS.glass,
              borderColor: COLORS.border,
              boxShadow: `0 8px 30px ${COLORS.shadow}`,
              backdropFilter: "blur(12px)",
            }}
            variants={itemVariants}
            whileHover={{
              scale: 1.07,
              background: "rgba(255, 255, 255, 0.45)",
              boxShadow: `0 12px 40px ${COLORS.shadow}`,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-5xl mb-2 drop-shadow-md">{btn.emoji}</span>
            <span
              className="text-lg font-extrabold tracking-wide drop-shadow-sm"
              style={{ color: COLORS.buttonText }}
            >
              {btn.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* 🔻 Bottom Navbar */}
      <BottomNavbar />
    </motion.div>
  );
}
