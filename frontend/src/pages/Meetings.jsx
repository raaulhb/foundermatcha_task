/**
 * Meetings Page Component
 * Shows all scheduled meetings for the current user
 */

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  /**
   * Subscribe to meetings in real-time
   */
  useEffect(() => {
    if (!currentUser) return;

    // Query meetings where current user is a participant
    const q = query(
      collection(db, "meetings"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("startTime", "asc")
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const meetingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMeetings(meetingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching meetings:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);

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
   * Check if meeting is in the past
   */
  const isPastMeeting = (startTime) => {
    if (!startTime) return false;
    return startTime.toDate() < new Date();
  };

  /**
   * Get other participant name (not current user)
   */
  const getOtherParticipant = (meeting) => {
    const otherIndex =
      meeting.participants.indexOf(currentUser.uid) === 0 ? 1 : 0;
    return meeting.participantNames[otherIndex];
  };

  /**
   * Separate meetings into upcoming and past
   */
  const upcomingMeetings = meetings.filter((m) => !isPastMeeting(m.startTime));
  const pastMeetings = meetings.filter((m) => isPastMeeting(m.startTime));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Meetings</h2>
          <p className="text-gray-600 mt-2">View all your scheduled meetings</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 mt-4">Loading meetings...</p>
          </div>
        )}

        {/* Meetings content */}
        {!loading && (
          <div className="space-y-8">
            {/* Upcoming Meetings Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📅</span>
                Upcoming Meetings
                <span className="ml-3 text-sm font-normal text-gray-500">
                  ({upcomingMeetings.length})
                </span>
              </h3>

              {upcomingMeetings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No upcoming meetings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Meeting title */}
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {meeting.title}
                          </h4>

                          {/* Meeting description */}
                          {meeting.description && (
                            <p className="text-gray-600 mb-3">
                              {meeting.description}
                            </p>
                          )}

                          {/* Participants */}
                          <div className="flex items-center space-x-2 text-gray-700 mb-2">
                            <span className="text-xl">👥</span>
                            <span className="font-medium">
                              Meeting with {getOtherParticipant(meeting)}
                            </span>
                          </div>

                          {/* Date and time */}
                          <div className="flex items-center space-x-2 text-gray-700">
                            <span className="text-xl">🕐</span>
                            <span className="font-medium">
                              {formatDateTime(meeting.startTime)}
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Meetings Section */}
            {pastMeetings.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  Past Meetings
                  <span className="ml-3 text-sm font-normal text-gray-500">
                    ({pastMeetings.length})
                  </span>
                </h3>

                <div className="space-y-4">
                  {pastMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-gray-300 opacity-75"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Meeting title */}
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {meeting.title}
                          </h4>

                          {/* Meeting description */}
                          {meeting.description && (
                            <p className="text-gray-600 mb-3">
                              {meeting.description}
                            </p>
                          )}

                          {/* Participants */}
                          <div className="flex items-center space-x-2 text-gray-700 mb-2">
                            <span className="text-xl">👥</span>
                            <span className="font-medium">
                              Meeting with {getOtherParticipant(meeting)}
                            </span>
                          </div>

                          {/* Date and time */}
                          <div className="flex items-center space-x-2 text-gray-700">
                            <span className="text-xl">🕐</span>
                            <span className="font-medium">
                              {formatDateTime(meeting.startTime)}
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state - no meetings at all */}
            {meetings.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No meetings yet
                </h3>
                <p className="text-gray-600">
                  When you accept meeting invitations, they will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
