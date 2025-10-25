import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './Components/Authapges/AuthPage.jsx';
import Home from './Components/Home/Home.jsx';
import MissYouStats from './Components/Stats/miss.jsx';
import InvitePage from './Components/Home/InvitePage.jsx';
import Profile from './Components/Stats/profileData.jsx';
import UnderConstruction from './Components/Stats/underConstruction.jsx';
export default function App() {
  return (
   <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/underconstruction" element={<UnderConstruction />} />
        <Route path="/missyou" element={<MissYouStats user={JSON.parse(localStorage.getItem("user"))} />} />
      </Routes>
    </Router>
  )
}

