import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Helpline from "./pages/Helpline";
import SafePlaces from "./pages/SafePlaces";
import Profile from "./pages/Profile";
import ReportIncident from "./pages/ReportIncident";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/report-incident"
          element={
            <ProtectedRoute>
              <ReportIncident />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
