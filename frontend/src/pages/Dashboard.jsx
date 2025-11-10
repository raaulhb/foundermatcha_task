/**
 * Dashboard Page Component
 * Main page showing all users and navigation
 */

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  /**
   * Fetch all users from Firestore
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Query users collection ordered by displayName
        const usersQuery = query(
          collection(db, "users"),
          orderBy("displayName", "asc")
        );

        const querySnapshot = await getDocs(usersQuery);

        // Map documents to user objects
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Handle invite button click
   * Navigate to invite form with selected user
   */
  const handleInvite = (user) => {
    navigate("/invite", { state: { selectedUser: user } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Users</h2>
          <p className="text-gray-600 mt-2">
            Browse users and send meeting invitations
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Users grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onInvite={handleInvite}
                isCurrentUser={user.id === currentUser?.uid}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
