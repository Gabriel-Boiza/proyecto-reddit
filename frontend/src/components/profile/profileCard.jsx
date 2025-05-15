import { Link } from "react-router-dom";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

function ProfileCard({ user, deleteAccount, isOwner }) {
  const [copied, setCopied] = useState(false);

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    const profileLink = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-bold">{user.username}</h2>
      </div>
      <hr className="border-gray-700 my-4 mx-2" />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p>{user.postCount}</p>
          <p>Posts</p>
        </div>
        <div>
          <p>{user.commentCount}</p>
          <p>Comments</p>
        </div>
        <div>
          <p>{user.upvotes}</p>
          <p>Upvotes</p>
        </div>
        <div>
          <p>{user.downvotes}</p>
          <p>Downvotes</p>
        </div>
      </div>

      {isOwner && (
        <>
          <hr className="border-gray-700 my-4 mx-2" />

          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2">SETTINGS</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full"
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
                  alt="Avatar"
                />
                <div>
                  <p className="text-white text-sm">Profile</p>
                  <Link to="/editProfile" className="text-xs hover:underline">
                    Customize your profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-700 my-4 mx-2" />

          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2">MEDIA</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button className="flex bg-gray-700 text-white text-xs rounded-full px-3 w-34 py-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-700 my-4 mx-2" />

          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2">SHARE MY PROFILE</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex bg-gray-700 text-white text-xs rounded-full px-3 w-34 py-1"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-700 my-4 mx-2" />

          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2">DELETE ACCOUNT</h3>
            <div className="flex justify-between items-center">
              <button
                onClick={deleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full"
              >
                Delete account
              </button>
            </div>
          </div>
        </>
      )}

      {/* Popup de éxito al copiar */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">Profile link copied to clipboard!</p>
        </div>
      )}
    </>
  );
}

export default ProfileCard;
