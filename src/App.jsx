import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Helpline from "./pages/Helpline";
import SafePlaces from "./pages/SafePlaces";
import Profile from "./pages/Profile";
import ReportIncident from "./pages/ReportIncident";
import CommunityFeed from "./pages/CommunityFeed";
import TrustedContacts from "./pages/TrustedContacts";
import SosHistory from "./pages/SosHistory";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <Assistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/helpline"
          element={
            <ProtectedRoute>
              <Helpline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/safe-places"
          element={
            <ProtectedRoute>
              <SafePlaces />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-incident"
          element={
            <ProtectedRoute>
              <ReportIncident />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community-feed"
          element={
            <ProtectedRoute>
              <CommunityFeed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trusted-contacts"
          element={
            <ProtectedRoute>
              <TrustedContacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sos-history"
          element={
            <ProtectedRoute>
              <SosHistory />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
