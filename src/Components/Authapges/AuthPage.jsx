import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🎨 Love Theme Palette
const COLORS = {
  background: "#FFE5EC",
  cardBg: "#FFFFFF",
  primaryPink: "#FB6F92",
  secondaryPink: "#FF8FAB",
  accentBorder: "#FFB3C6",
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate(); // ✅ correct lowercase

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   const baseUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const url = isLogin
        ? `${baseUrl}/api/users/login`
        : `${baseUrl}/api/users/register`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const { data } = await axios.post(url, payload);

      // ✅ Store user data and redirect
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("userId", data._id);
      navigate("/"); // ✅ lowercase navigate
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong 😢",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* 🌸 App Title */}
      <h1
        className="text-4xl font-extrabold tracking-widest mb-6 drop-shadow-md"
        style={{ color: COLORS.primaryPink }}
      >
        💞 Love Link
      </h1>

      {/* 🩷 Auth Card */}
      <div
        className="w-full max-w-sm p-6 sm:p-8 rounded-3xl shadow-2xl transition duration-500 ease-in-out"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: COLORS.primaryPink }}
        >
          {isLogin ? "💕 Welcome Back" : "💌 Join the Love"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username (Register only) */}
          {!isLogin && (
            <div>
              <label
                className="block mb-1 font-semibold text-sm"
                style={{ color: COLORS.primaryPink }}
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border-2 transition duration-200 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-offset-1"
                style={{ borderColor: COLORS.accentBorder }}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              className="block mb-1 font-semibold text-sm"
              style={{ color: COLORS.primaryPink }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border-2 transition duration-200 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-offset-1"
              style={{ borderColor: COLORS.accentBorder }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block mb-1 font-semibold text-sm"
              style={{ color: COLORS.primaryPink }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border-2 transition duration-200 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-offset-1"
              style={{ borderColor: COLORS.accentBorder }}
            />
          </div>

          {/* Message/Error */}
          {message.text && (
            <p
              className="text-sm font-medium text-center p-2 rounded-lg"
              style={{
                color:
                  message.type === "error"
                    ? COLORS.primaryPink
                    : "green",
                backgroundColor:
                  message.type === "error"
                    ? COLORS.accentBorder + "80"
                    : "#dcfce7",
              }}
            >
              {message.text}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full font-bold text-white py-3 rounded-xl transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            style={{ backgroundColor: COLORS.secondaryPink }}
          >
            {isLogin ? "Login 💘" : "Register 💕"}
          </button>
        </form>

        {/* Toggle */}
        <p
          className="text-center mt-6 text-sm"
          style={{ color: COLORS.primaryPink }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="underline font-extrabold transition duration-200"
            style={{ color: COLORS.primaryPink }}
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
