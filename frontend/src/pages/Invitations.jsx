/**
 * Invitations Page Component
 * Shows all meeting invitations received by the current user
 * Allows accepting or rejecting invitations
 */

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { currentUser } = useAuth();

  /**
   * Subscribe to invitations in real-time
   */
  useEffect(() => {
    if (!currentUser) return;

    // Query invitations where current user is the receiver
    const q = query(
      collection(db, "invitations"),
      where("receiverId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invitationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInvitations(invitationsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching invitations:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Handle accepting an invitation
   * Updates invitation status and creates a meeting
   */
  const handleAccept = async (invitation) => {
    try {
      setProcessingId(invitation.id);

      // Update invitation status to 'accepted'
      await updateDoc(doc(db, "invitations", invitation.id), {
        status: "accepted",
        updatedAt: Timestamp.now(),
      });

      // Calculate meeting end time (1 hour after start)
      const startTime = invitation.proposedTime.toDate();
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

      // Create meeting document
      const meetingData = {
        title: invitation.title,
        description: invitation.description || "",
        participants: [invitation.senderId, invitation.receiverId],
        participantNames: [invitation.senderName, invitation.receiverName],
        startTime: invitation.proposedTime,
        endTime: Timestamp.fromDate(endTime),
        createdFrom: invitation.id,
        createdAt: Timestamp.now(),
        status: "scheduled",
      };

      await addDoc(collection(db, "meetings"), meetingData);

      console.log("Invitation accepted and meeting created!");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      alert("Failed to accept invitation. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Handle rejecting an invitation
   */
  const handleReject = async (invitation) => {
    try {
      setProcessingId(invitation.id);

      // Update invitation status to 'rejected'
      await updateDoc(doc(db, "invitations", invitation.id), {
        status: "rejected",
        updatedAt: Timestamp.now(),
      });

      console.log("Invitation rejected");
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      alert("Failed to reject invitation. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  /**
   * Format timestamp to readable date/time
   */
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "No date";

    const date = timestamp.toDate();
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Get status badge color
   */
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Meeting Invitations
          </h2>
          <p className="text-gray-600 mt-2">
            Review and respond to meeting requests
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading invitations...</p>
          </div>
        )}

        {/* Invitations list */}
        {!loading && (
          <div className="space-y-4">
            {invitations.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No invitations yet
                </h3>
                <p className="text-gray-600">
                  When someone sends you a meeting invitation, it will appear
                  here.
                </p>
              </div>
            ) : (
              /* Invitation cards */
              invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    {/* Left side: Invitation details */}
                    <div className="flex-1">
                      {/* Sender info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={invitation.senderAvatar}
                          alt={invitation.senderName}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        <div>
                          <p className="text-sm text-gray-600">
                            Meeting invitation from
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {invitation.senderName}
                          </p>
                        </div>
                      </div>

                      {/* Meeting details */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {invitation.title}
                        </h3>

                        {invitation.description && (
                          <p className="text-gray-600">
                            {invitation.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-2 text-gray-700">
                          <span className="text-2xl">📅</span>
                          <span className="font-medium">
                            {formatDateTime(invitation.proposedTime)}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="mt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                            invitation.status
                          )}`}
                        >
                          {invitation.status.charAt(0).toUpperCase() +
                            invitation.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Action buttons (only for pending) */}
                    {invitation.status === "pending" && (
                      <div className="flex flex-col space-y-2 ml-6">
                        <button
                          onClick={() => handleAccept(invitation)}
                          disabled={processingId === invitation.id}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === invitation.id
                            ? "Processing..."
                            : "Accept"}
                        </button>
                        <button
                          onClick={() => handleReject(invitation)}
                          disabled={processingId === invitation.id}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitations;
