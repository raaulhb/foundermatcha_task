/**
 * Navigation Bar Component
 * Displays user info and logout button at the top of the app
 */

import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title and Navigation */}
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-indigo-600">
              Meeting Scheduler
            </h1>

            {/* Navigation links */}
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Users
              </Link>
              <Link
                to="/invitations"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Invitations
              </Link>

              <Link
                to="/meetings"
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Meetings
              </Link>
            </nav>
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            {/* User avatar and name */}
            {userProfile && (
              <div className="flex items-center space-x-3">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.displayName}
                  className="w-10 h-10 rounded-full border-2 border-indigo-200"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile.displayName}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
