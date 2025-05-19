import React, { useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

const FollowedUser = ({ avatar, username, fullName, userId }) => {

  return (
    <Link to={`/profile/${username}`} className="block">
      <div className="hover:bg-[#2a2a2a] transition-colors duration-200 px-3 py-2 border-b border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img 
              src={avatar} 
              alt={`${username} avatar`} 
              className="w-10 h-10 rounded-full border border-muted shadow"
            />
          </div>
          <div className="ml-3 flex-grow">
            <div className="font-medium text-white text-sm hover:underline">{username}</div>
            <div className="text-sm text-gray-400">{fullName}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};  

export default FollowedUser