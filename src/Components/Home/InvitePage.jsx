import axios from 'axios';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './comps/header.jsx';
import NavBar from './comps/navbar.jsx';

// Color Palette for reference:
// Pink 50: #ffe5ec
// Pink 100: #ffc2d1
// Pink 200: #ffb3c6
// Pink 300: #ff8fab
// Pink 400: #fb6f92

// --- Loading/Notification Component ---
const NotificationModal = ({ isVisible, message, type, onClose }) => {
    if (!isVisible) return null;
    
    const bgColor = type === 'success'
        ? 'bg-green-500' // Use a contrasting color for system feedback
        : type === 'error'
        ? 'bg-red-500'
        : 'bg-[#fb6f92]'; // Pink 400 for loading

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '❤️';
    
    // Animation variants for the modal
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`p-6 rounded-xl shadow-2xl text-white max-w-sm w-full ${bgColor} flex flex-col items-center`}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-3xl mb-3">{icon}</div>
                        <p className="font-semibold text-center mb-4">{message}</p>
                        {type !== 'loading' && (
                            <button
                                onClick={onClose}
                                className="mt-2 text-sm font-bold border border-white px-4 py-1 rounded-full hover:bg-white hover:text-gray-800 transition"
                            >
                                Close
                            </button>
                        )}
                        {type === 'loading' && (
                            <motion.div
                                className="w-6 h-6 border-4 border-t-4 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export default function InvitePage() {
    const [notification, setNotification] = useState({ isVisible: false, message: '', type: '' });
    const inviteCodeRef = React.useRef(null);

    const showNotification = (message, type = 'loading', duration = 2000) => {
        setNotification({ isVisible: true, message, type });
        if (type !== 'loading') {
            setTimeout(() => setNotification({ isVisible: false, message: '', type: '' }), duration);
        }
    };

    const closeNotification = () => {
        setNotification({ isVisible: false, message: '', type: '' });
    };

    // --- API Functions ---

    const generateInvite = async () => {
        showNotification("Generating your special link...", 'loading');
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.token) throw new Error("User not authenticated.");
             const baseUrl = process.env.REACT_APP_BACKEND_URL;
            const res = await axios.post(
                `${baseUrl}/api/users/invite/`,
                { expiresInDays: 7, message: "Let's connect ❤️" },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            const { link } = res.data;
            await navigator.clipboard.writeText(link);
            showNotification("Link copied! Share it with your partner. 🎉", 'success', 3000);
        } catch (error) {
            console.error("Error generating invite:", error);
            showNotification("Failed to generate invite. Please log in.", 'error', 4000);
        }
    };

    const copyInviteLink = async () => {
        showNotification("Fetching your active link...", 'loading');
         const baseUrl = process.env.REACT_APP_BACKEND_URL;
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.token) throw new Error("User not authenticated.");

            const res = await axios.get(`${baseUrl}/api/users/invite`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            const { link } = res.data;
            await navigator.clipboard.writeText(link);
            showNotification("Link copied! Ready to share. 💌", 'success', 3000);
        } catch (error) {
            console.error("Error copying invite:", error);
            showNotification("Failed to get active invite. Generate a new one!", 'error', 4000);
        }
    };

    const connectPartner = async () => {
        const inviteCode = inviteCodeRef.current ? inviteCodeRef.current.value.trim() : '';
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        if (!inviteCode) {
            showNotification("Please enter an invite code.", 'error', 3000);
            return;
        }

        showNotification("Connecting with your partner...", 'loading');

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.token) throw new Error("User not authenticated.");

            await axios.post(
                `${baseUrl}/api/users/invite/accept/${inviteCode}`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            showNotification("Connection successful! Welcome aboard! 🥂", 'success', 4000);
            if(inviteCodeRef.current) inviteCodeRef.current.value = '';

        } catch (err) {
            const message = err.response?.data?.message || err.message || "An unknown error occurred.";
            showNotification(`Connection failed: ${message}`, 'error', 5000);
        }
    };


    // Helper component for the styled button (using motion)
    const StyledButton = ({ onClick, children, variant = 'primary' }) => {
        const primaryClasses = "bg-[#fb6f92] hover:bg-[#ff8fab] text-white"; // Pink 400 & 300
        const secondaryClasses = "bg-[#ffc2d1] hover:bg-[#ffb3c6] text-[#fb6f92]"; // Pink 100 & 200, text Pink 400

        const baseClasses = `transition-colors duration-200 font-semibold py-3 px-6 rounded-full shadow-lg w-full md:w-auto`;

        return (
            <motion.button
                onClick={onClick}
                className={`${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {children}
            </motion.button>
        );
    };


    // Animation variants for the main content container
    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };


    return (
        <div className="bg-[#ffe5ec] min-h-screen flex flex-col relative items-center justify-center px-4 py-10">
            <NotificationModal 
                isVisible={notification.isVisible} 
                message={notification.message} 
                type={notification.type} 
                onClose={closeNotification} 
            />
            <Header />
            <motion.div
                className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#fb6f92] mb-10 tracking-wider">
                    Connect with Your Love
                </h1>

                {/* --- Connect by Code Section --- */}
                <motion.div 
                    className="mb-10 p-6 border-2 border-[#ffb3c6] rounded-xl bg-[#ffc2d1]/30"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold text-[#ff8fab] mb-4">
                        Add Partner by Code
                    </h2>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            ref={inviteCodeRef}
                            type="text"
                            placeholder="Enter invite code"
                            className="flex-grow p-3 rounded-full border-2 border-[#ff8fab] focus:outline-none focus:ring-2 focus:ring-[#fb6f92] transition duration-200 text-gray-700 placeholder-gray-400"
                        />
                        <StyledButton onClick={connectPartner}>
                            Connect
                        </StyledButton>
                    </div>
                </motion.div>

                {/* --- Invite Link Section --- */}
                <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <StyledButton onClick={generateInvite}>
                        Generate New Invite Link
                    </StyledButton>
                    <div className="text-sm text-gray-500 pt-1">
                        (Generates a new link and copies it)
                    </div>

                    <div className="pt-4">
                        <StyledButton onClick={copyInviteLink} variant="secondary">
                            Copy Latest Link
                        </StyledButton>
                        <div className="text-sm text-gray-500 pt-1">
                            (Copies your currently active link)
                        </div>
                    </div>
                </motion.div>
               
            </motion.div>
             <NavBar />
        </div>
    );
}