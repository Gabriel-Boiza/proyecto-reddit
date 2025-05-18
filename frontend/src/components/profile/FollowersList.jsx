import { Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { domain } from "../../context/domain";

const FollowersList = ({ followers }) => {
  
  return (
    <>
      {followers && followers.length > 0 ? (
        followers.map(follower => (
          <div key={follower._id}>
            <div>
              <a
                href={`/profile/${follower.username}`}
                className="block rounded-md p-4 hover:bg-gray-800 w-[100%] flex items-center"
              >
                <img 
                  className="w-12 h-12 rounded-full mr-4" 
                  src={
                    follower.profileImage 
                      ? `${domain}uploads/${follower.profileImage}`
                      : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
                  }
                  alt={`${follower.username}'s profile`}
                />
                <div className="flex-1">
                  <h3 className="text-lg text-[#B7CAD4] font-semibold">{follower.username}</h3>
                  <p className="text-gray-400 text-sm">{follower.name}</p>
                </div>
              </a>

            </div>
            <hr className="border-t border-gray-700 mt-2 mx-2" />
          </div>
        ))
      ) : (
        <p className="text-gray-500 p-4">No followers to show.</p>
      )}
    </>
  );
};

export default FollowersList;