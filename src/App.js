import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './Components/Authapges/AuthPage.jsx';
import Home from './Components/Home/Home.jsx';
import MissYouStats from './Components/Stats/miss.jsx';
import InvitePage from './Components/Home/InvitePage.jsx';
import Profile from './Components/Stats/profileData.jsx';
import UnderConstruction from './Components/Stats/underConstruction.jsx';
import ProtectedRoute from './Components/ProtectedRoutes/protectRoute.jsx';
export default function App() {
  return (
   <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
          {/* Protected routes */}
        <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/missyou" element={<ProtectedRoute><MissYouStats user={JSON.parse(localStorage.getItem("user"))} /></ProtectedRoute>} />
        <Route path="/underconstruction" element={<UnderConstruction />} />
      </Routes>
    </Router>
  )
}

