import { Link } from "react-router-dom";
import { domain } from "../../context/domain";

const FollowingList = ({ following }) => {
  return (
    <>
      {following && following.length > 0 ? (
        following.map(followedUser => (
          <div key={followedUser._id}>
            <div>
              <Link
                to={`/profile/${followedUser.username}`}
                className="block rounded-md p-4 hover:bg-gray-800 w-[100%] flex items-center"
              >
                <img 
                  className="w-12 h-12 rounded-full mr-4" 
                  src={
                    followedUser.profileImage 
                      ? `${domain}uploads/${followedUser.profileImage}`
                      : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
                  }
                  alt={`${followedUser.username}'s profile`}
                />
                <div className="flex-1">
                  <h3 className="text-lg text-[#B7CAD4] font-semibold">{followedUser.username}</h3>
                  <p className="text-gray-400 text-sm">{followedUser.name}</p>
                </div>
              </Link>
            </div>
            <hr className="border-t border-gray-700 mt-2 mx-2" />
          </div>
        ))
      ) : (
        <p className="text-gray-500 p-4">Not following anyone yet.</p>
      )}
    </>
  );
};

export default FollowingList;