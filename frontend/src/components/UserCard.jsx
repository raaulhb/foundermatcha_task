/**
 * User Card Component
 * Displays individual user information with action button
 */

const UserCard = ({ user, onInvite, isCurrentUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* User avatar */}
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.displayName}
          className="w-16 h-16 rounded-full border-2 border-gray-200"
        />

        <div className="flex-1">
          {/* User name */}
          <h3 className="text-lg font-semibold text-gray-900">
            {user.displayName}
            {isCurrentUser && (
              <span className="ml-2 text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                You
              </span>
            )}
          </h3>

          {/* User bio */}
          <p className="text-sm text-gray-600 mt-1">
            {user.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Action button - only show for other users */}
      {!isCurrentUser && (
        <button
          onClick={() => onInvite(user)}
          className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Send Meeting Invite
        </button>
      )}
    </div>
  );
};

export default UserCard;
