import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../layouts/header';
import Aside from '../../layouts/aside';
import { domain } from '../../context/domain';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${domain}getAllUsers`);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#14181a]">
      <Header />
      <div className="pt-16"> {/* Add padding-top for fixed header */}
        <Aside />
        <div className="flex">
          <main className="content w-full p-4 md:ml-80">
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-100 mb-6">Find Users</h1>
                
                {/* Search input */}
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by username or name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md leading-5 bg-[#272729] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Loading and error states */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-300"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
              ) : (
                /* Users list */
                <div className="space-y-3">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <Link
                        to={`/profile/${user.username}`}
                        key={user._id}
                        className="flex items-center bg-[#272729] p-4 rounded-md transition duration-200 hover:bg-[#343536] hover:cursor-pointer"
                      >
                        {/* User avatar */}
                        <div className="flex-shrink-0 mr-4">
                          {user.profileImage ? (
                            <img 
                              src={`http://localhost:3000/uploads/${user.profileImage}`} 
                              alt={`${user.username}'s profile`}
                              className="h-12 w-12 rounded-full object-cover" 
                            />
                          ) : (
                            <img 
                              src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png`} 
                              alt={`${user.username}'s profile`}
                              className="h-12 w-12 rounded-full object-cover" 
                            />
                          )}
                        </div>

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-100 font-medium">{user.username}</p>
                          <p className="text-gray-500 text-sm">{user.name}</p>
                          <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                            <span>{user.posts?.length || 0} posts</span>
                            <span>{user.followers?.length || 0} followers</span>
                            <span>{user.following?.length || 0} following</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No users found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
