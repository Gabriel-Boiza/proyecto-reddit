import { useState, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import FollowedUser from './FollowedUser';
import { domain } from '../../context/domain';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FollowList = () => {
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    getFollowedUsers();
  }, []);

  const getFollowedUsers = async () => {
    try {
      const response = await axios.get(`${domain}getFollowedUsers`, {
        withCredentials: true,
      });
      setFollowedUsers(response.data.following || []);
    } catch (error) {
      console.error("Error fetching followed users:", error);
    }
  };

  return (
    <Card className="bg-[#1e1e1e] overflow-hidden shadow-lg border-muted">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="font-semibold text-white">Following</h2>
      </div>

      {/* Lista de usuarios */}
      <div className="max-h-96 overflow-y-auto">
        {followedUsers.map(user => (
          <FollowedUser 
            key={user.id}
            avatar={
              user.profileImage
                ? domain + "uploads/" + user.profileImage
                : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
            }
            username={user.username}
            fullName={user.fullName}
            userId={user.id}
          />
        ))}
      </div>

      {/* Botón "Search Users" */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/searchusers"
          className="block w-full text-center py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition duration-200"
        >
          Search Users
        </Link>
      </div>
    </Card>
  );
};

export default FollowList;
