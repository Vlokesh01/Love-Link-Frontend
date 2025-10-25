import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { socket } from "../socket/socket.js";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Home/comps/header.jsx";
import Navbar from "../Home/comps/navbar.jsx";

/* ---------------------------------------------------
 💖 Small helper components
--------------------------------------------------- */

// ❤️ Heart SVG icon — reused in hearts, buttons, etc.
const HeartIcon = ({ size = 24, className = "", filled = true }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`fill-current ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    {filled ? (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    ) : (
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    )}
  </svg>
);

// 🧍 User doodle emoji animation
const MyDoodle = () => (
  <motion.span
    className="text-4xl"
    role="img"
    aria-label="My icon"
    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
  >
    😊
  </motion.span>
);

// 🩷 Partner doodle emoji animation
const PartnerDoodle = () => (
  <motion.span
    className="text-4xl"
    role="img"
    aria-label="Partner icon"
    animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
    transition={{
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut",
      delay: 0.5,
    }}
  >
    😍
  </motion.span>
);

/* ---------------------------------------------------
 💫 Flying & Floating Hearts (for animation effects)
--------------------------------------------------- */

// 💘 Hearts that fly from your button to your partner
const FlyingHeart = ({
  initialX,
  initialY,
  targetX,
  targetY,
  onAnimationComplete,
  size,
  color,
}) => {
  const duration = Math.random() * 0.7 + 0.8;
  const randomRotation = Math.random() * 70 - 35;
  const delay = Math.random() * 0.2;
  const randomPathOffset = Math.random() * 50 - 25;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: initialX, y: initialY }}
      animate={{
        opacity: [1, 1, 0],
        x: [initialX, targetX + randomPathOffset, targetX],
        y: [initialY, targetY + randomPathOffset, targetY],
        scale: [0, 1.2, 0.8],
        rotate: randomRotation,
      }}
      transition={{ duration, ease: "easeOut", delay }}
      onAnimationComplete={onAnimationComplete}
      className="absolute z-50 pointer-events-none"
    >
      <HeartIcon size={size || 20} className={color || "text-red-400"} />
    </motion.div>
  );
};

// 💞 Floating hearts that drift in the background
const FloatingHeart = ({ delay }) => (
  <motion.div
    className="absolute opacity-20"
    initial={{ y: "100vh", x: Math.random() * 100 + "%" }}
    animate={{ y: "-10vh" }}
    transition={{ duration: 10, repeat: Infinity, delay, ease: "linear" }}
  >
    <HeartIcon size={Math.random() * 20 + 10} className="text-pink-300" />
  </motion.div>
);

/* ---------------------------------------------------
 🌸 Main MissYouStats Component
--------------------------------------------------- */
export default function MissYouStats() {
  // Logged-in user (from localStorage)
  const user = JSON.parse(localStorage.getItem("user"));

  // Stats from server
  const [stats, setStats] = useState({
    youClicked: { count: 0, streak: 0 },
    partnerClicked: { count: 0, streak: 0 },
  });

  // State for partner existence
  const [partnerExists, setPartnerExists] = useState(true);
  const [partnerId, setPartnerId] = useState(user?.partnerId || null);

  // Animations and UI states
  const [pop, setPop] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  console.log(pop);
  console.log(showConfetti);

  // Refs for measuring heart flight positions
  const partnerDoodleRef = useRef(null);
  const missYouButtonRef = useRef(null);
  const baseUrl = process.env.REACT_APP_BACKEND_URL;

  /* -----------------------------
   🧠 Helper: Format timeline time
  ----------------------------- */
  function formatMinute(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* -----------------------------
   🧩 Memoized grouped timeline
  ----------------------------- */
  const groupedTimeline = useMemo(() => {
    const groups = [];
    timeline
      .slice()
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach((t) => {
        const minuteKey = formatMinute(t.timestamp);
        const last = groups[groups.length - 1];
        if (
          last &&
          last.minute === minuteKey &&
          String(last.userId) === String(t.userId)
        ) {
          last.count += 1;
        } else {
          groups.push({ ...t, minute: minuteKey, count: 1 });
        }
      });
    return groups.reverse();
  }, [timeline]);

  /* -----------------------------
   ⚡ Fetch + Socket setup
  ----------------------------- */
  useEffect(() => {
    if (!user) return;

    socket.emit("joinRoom", user._id);

    // Handle live updates
    const handleUpdate = (data) => {
      if (data.sender === user._id) {
        setStats((prev) => ({
          ...prev,
          youClicked: { count: data.count, streak: data.streak },
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          partnerClicked: { count: data.count, streak: data.streak },
        }));
      }
    };

    socket.on("updateStats", handleUpdate);

    // Initial data fetch
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/users/missyou/stats`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const data = res.data;
        setStats(data);

        // 🩷 Detect if user has no partner from server response
        setPartnerId(data.partnerId);
        setPartnerExists(!!data.partnerId);

        // Normalize timeline data
        const rawTimeline = data.timeline || [];
        const normalized = rawTimeline
          .map((t) => ({
            ...t,
            userId: String(t.userId?._id || t.userId || ""),
            time:
              t.time ||
              t.timestamp ||
              t.createdAt ||
              t.lastClicked ||
              t.date ||
              t.ts ||
              null,
          }))
          .filter((item) => item.time && item.userId);

        setTimeline(normalized);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();

    return () => {
      socket.off("updateStats", handleUpdate);
    };
  }, [user, baseUrl]);

  /* -----------------------------
   💘 Heart flying animation setup
  ----------------------------- */
  const spawnHearts = (count = 25) => {
    if (!partnerDoodleRef.current || !missYouButtonRef.current) return;

    const containerRect = missYouButtonRef.current
      .closest(".relative")
      .getBoundingClientRect();
    const partnerRect = partnerDoodleRef.current.getBoundingClientRect();
    const buttonRect = missYouButtonRef.current.getBoundingClientRect();

    const targetX =
      partnerRect.left + partnerRect.width / 2 - containerRect.left;
    const targetY =
      partnerRect.top + partnerRect.height / 2 - containerRect.top;
    const initialX =
      buttonRect.left + buttonRect.width / 2 - containerRect.left;
    const initialY = buttonRect.top + buttonRect.height / 2 - containerRect.top;

    const colors = [
      "text-red-400",
      "text-pink-400",
      "text-purple-400",
      "text-rose-400",
    ];
    const newHearts = [];

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: Date.now() + i,
        initialX: initialX + (Math.random() * 30 - 15),
        initialY: initialY + (Math.random() * 30 - 15),
        targetX,
        targetY,
        size: Math.random() * 15 + 15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setHearts(newHearts);
  };

  const removeHeart = (id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  /* -----------------------------
   💞 Miss You button handler
  ----------------------------- */
  const handleMissYouClick = async () => {
    if (!user) return;
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    // If no partner, show alert instead of sending
    if (!partnerId) {
      alert("You don’t have a partner yet 💖");
      return;
    }

    try {
      setPop(true);
      setShowConfetti(true);
      spawnHearts(25);

      await axios.post(
        `${baseUrl}/api/users/missyou/click`,
        { sender: user._id, receiver: partnerId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      socket.emit("missYouClicked", {
        senderId: user._id,
        receiverId: partnerId,
      });

      setTimeout(() => {
        setPop(false);
        setShowConfetti(false);
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  /* -----------------------------
   💔 Solo Mode (no partner)
  ----------------------------- */
  if (!partnerExists) {
    return (
      <motion.div
        className="max-w-sm mx-auto bg-white shadow-2xl shadow-pink-200 rounded-3xl p-8 mt-10 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header />
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          💌 Miss You Tracker
        </h2>
        <p className="text-gray-500 mb-6">
          You don’t have a partner yet 😔
          <br />
          But you can still track your love journey 💖
        </p>

        <MyDoodle />

        <div className="bg-pink-50 rounded-xl p-4 mt-6">
          <p className="text-gray-600 font-semibold mb-1">You clicked:</p>
          <motion.p
            key={stats.youClicked.count}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-pink-600"
          >
            {stats.youClicked.count}
          </motion.p>
          <p className="text-sm text-gray-400">
            Streak: {stats.youClicked.streak} 🔥
          </p>
        </div>

        <motion.button
          onClick={handleMissYouClick}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="mt-6 bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-2 rounded-full font-bold shadow-md"
        >
          <HeartIcon size={20} className="inline-block mr-2" /> Miss You 💖
        </motion.button>

        <Navbar />
      </motion.div>
    );
  }

  /* -----------------------------
   💑 Partner Mode (normal UI)
  ----------------------------- */
  const youCountKey = stats.youClicked.count;
  const partnerCountKey = stats.partnerClicked.count;

  return (
    <div>
      <div>
        <Header />
        <motion.div
          className="max-w-sm mx-auto  rounded-3xl p-10 mt-20 text-center relative "
          style={{
            background: "linear-gradient(160deg, #FFE5EC 0%, #FFC2D1 100%)",
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating background hearts */}
          <div className="absolute inset-0 pointer-events-none ">
            {Array.from({ length: 10 }).map((_, i) => (
              <FloatingHeart key={i} delay={i * 1.5} />
            ))}
          </div>

          <motion.h2
            className="text-2xl font-extrabold mb-6 text-pink-600 drop-shadow-md"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            💘 Our Connection 💕
          </motion.h2>

          {/* Flying Hearts Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
              {hearts.map((heart) => (
                <FlyingHeart
                  key={heart.id}
                  {...heart}
                  onAnimationComplete={() => removeHeart(heart.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Stats Display */}
          <div className="flex justify-around items-end mb-8 border-b pb-4 border-pink-100">
            {/* You */}
            <div className="text-center w-1/2">
              <MyDoodle />
              <p className="text-md font-medium text-gray-500 mt-1 mb-1">Me</p>
              <motion.div key={youCountKey} animate={{ scale: [1, 1.2, 1] }}>
                <p className="text-4xl font-black text-blue-500">
                  {stats.youClicked.count}
                </p>
              </motion.div>
              <p className="text-sm text-gray-400 mt-1">
                Streak: {stats.youClicked.streak} 🔥
              </p>
            </div>

            {/* Animated Heart */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <HeartIcon size={35} className="text-red-500 animate-pulse" />
            </motion.div>

            {/* Partner */}
            <div className="text-center w-1/2">
              <span ref={partnerDoodleRef}>
                <PartnerDoodle />
              </span>
              <p className="text-md font-medium text-gray-500 mt-1 mb-1">
                Partner
              </p>
              <motion.div
                key={partnerCountKey}
                animate={{ scale: [1, 1.2, 1] }}
              >
                <p className="text-4xl font-black text-pink-500">
                  {stats.partnerClicked.count}
                </p>
              </motion.div>
              <p className="text-sm text-gray-400 mt-1">
                Streak: {stats.partnerClicked.streak} 🔥
              </p>
            </div>
          </div>

          {/* Miss You Button */}
          <motion.button
            ref={missYouButtonRef}
            onClick={handleMissYouClick}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-red-400 to-pink-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl"
          >
            <HeartIcon size={20} className="inline-block mr-2 animate-bounce" />
            Miss You 💖
          </motion.button>

          {/* Timeline Section */}
          <div className="mt-8 text-left max-h-48 overflow-y-auto bg-pink-50/50 p-3 rounded-xl">
            <motion.h3
              className="text-lg font-semibold text-pink-600 mb-2"
              animate={{ x: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              TODAY 💌
            </motion.h3>

            {groupedTimeline.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                No clicks yet... send some love 💞
              </p>
            ) : (
              <ul className="space-y-2">
                {groupedTimeline.map((t, i) => {
                  const isYou = String(t.userId) === String(user._id);
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={`text-sm ${
                        isYou ? "text-blue-600" : "text-pink-600"
                      } bg-white/70 rounded-xl p-2 shadow-sm`}
                    >
                      {isYou ? "You" : "Partner"} sent ❤️ ×{t.count} at{" "}
                      {t.minute}
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>

          <Navbar />
        </motion.div>
      </div>
    </div>
  );
}
