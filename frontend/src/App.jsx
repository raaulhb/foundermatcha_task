/**
 * Main App Component
 * Sets up routing and authentication context
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InvitePage from "./pages/InvitePage";
import Invitations from "./pages/Invitations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invite"
            element={
              <ProtectedRoute>
                <InvitePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invitations"
            element={
              <ProtectedRoute>
                <Invitations />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
