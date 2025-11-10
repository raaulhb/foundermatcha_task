/**
 * Invite Page Component
 * Form to send meeting invitation to a selected user
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const InvitePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  // Get selected user from navigation state
  const selectedUser = location.state?.selectedUser;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    proposedDate: "",
    proposedTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if no user selected
  if (!selectedUser) {
    navigate("/dashboard");
    return null;
  }

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.proposedDate || !formData.proposedTime) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate date is not in the past
    const proposedDateTime = new Date(
      `${formData.proposedDate}T${formData.proposedTime}`
    );
    if (proposedDateTime < new Date()) {
      setError("Meeting time must be in the future");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Create invitation document
      const invitationData = {
        senderId: currentUser.uid,
        senderName: userProfile.displayName,
        senderAvatar: userProfile.avatar,
        receiverId: selectedUser.id,
        receiverName: selectedUser.displayName,
        receiverAvatar: selectedUser.avatar,
        title: formData.title,
        description: formData.description,
        proposedTime: Timestamp.fromDate(proposedDateTime),
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "invitations"), invitationData);

      // Redirect to dashboard with success message
      navigate("/dashboard", {
        state: {
          message: `Invitation sent to ${selectedUser.displayName}!`,
        },
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      setError("Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get minimum date (today) for date input
   */
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>

          <h2 className="text-3xl font-bold text-gray-900">
            Send Meeting Invitation
          </h2>
          <p className="text-gray-600 mt-2">
            Invite{" "}
            <span className="font-semibold">{selectedUser.displayName}</span> to
            a meeting
          </p>
        </div>

        {/* Recipient card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            SENDING TO:
          </h3>
          <div className="flex items-center space-x-4">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.displayName}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {selectedUser.displayName}
              </p>
              <p className="text-sm text-gray-600">{selectedUser.bio}</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Invitation form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Meeting title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meeting Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Project Discussion, Coffee Chat"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            {/* Meeting description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any additional details about the meeting..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Date and time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date picker */}
              <div>
                <label
                  htmlFor="proposedDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Proposed Date *
                </label>
                <input
                  id="proposedDate"
                  name="proposedDate"
                  type="date"
                  value={formData.proposedDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              {/* Time picker */}
              <div>
                <label
                  htmlFor="proposedTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Proposed Time *
                </label>
                <input
                  id="proposedTime"
                  name="proposedTime"
                  type="time"
                  value={formData.proposedTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
