import { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import FollowedUser from './FollowedUser';
import { domain } from '../../context/domain';
import { useEffect } from 'react';
import axios from 'axios';

const FollowList = () => {
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    getFollowedUsers()
  }, [])

  const getFollowedUsers = async () => {
    const response = await axios.get(`${domain}getFollowedUsers`, {withCredentials: true,})
    setFollowedUsers(...followedUsers, response.data.following)

  }

  return (
    <Card className="bg-[#1e1e1e] overflow-hidden shadow-lg border-muted">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="font-semibold text-white">Followed</h2>
      </div>

      {/* Lista de usuarios */}
      <div className="max-h-96 overflow-y-auto">
        {followedUsers.map(user => (
          <FollowedUser 
            key={user.id}
            avatar={domain+"uploads/"+user.profileImage}
            username={user.username}
            fullName={user.fullName}
            userId={user.id}
          />
        ))}
      </div>
    </Card>
  );
};

export default FollowList;