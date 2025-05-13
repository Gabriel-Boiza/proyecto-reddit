import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { useAuth } from '../../context/authContext.js';
import { Plus } from "lucide-react";
import Swal from 'sweetalert2';

function ProfileCard({ user }) {

    const copyToClipboard = () => {
        const profileLink = `${window.location.origin}/profile/${user.username}`; // Suponiendo que la URL del perfil sea esta
        navigator.clipboard.writeText(profileLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000); // El mensaje se cierra después de 3 segundos
            })
            .catch((error) => {
                console.error("Error copying to clipboard:", error);
            });
    };

    const deleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Your account will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF6600',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete account',
            cancelButtonText: 'Cancel',
            background: '#1c1c1c',
            color: '#ffffff',
            customClass: {
                title: 'text-orange-500',
                content: 'text-gray-300',
                confirmButton: 'text-white border-none',
                cancelButton: 'text-white border-none',
            },
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`${domain}deleteAccount`, { withCredentials: true });
    
                // You can redirect the user or show a success message here
                Swal.fire({
                    title: 'Account deleted!',
                    text: 'Your account has been deleted.',
                    icon: 'success',
                    background: '#1c1c1c',
                    color: '#ffffff',
                    confirmButtonColor: '#FF6600',
                    customClass: {
                        title: 'text-orange-500',
                        content: 'text-gray-300',
                        confirmButton: 'text-white border-none',
                    },
                }).then(() => {
                    window.location.href = '/';  // Redirect to home or main page
                });
    
            } catch (err) {
                console.error("Error deleting account:", err);
                Swal.fire('Error', 'There was a problem deleting the account.', 'error');
            }
        }
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
  
                          <hr className="border-gray-700 my-4 mx-2" />
  
                          <div>
                              <h3 className="text-xs font-bold text-gray-400 mb-2">SETTINGS</h3>
                              <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                      <img className="w-8 rounded-full" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="" />
                                      <div>
                                          <p className="text-white text-sm">Profile</p>
                                          <Link to="/editProfile" className="text-xs">
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
                                      <div>
                                          <button className="flex bg-gray-700 text-white text-xs rounded-full px-3 w-34 py-1">
                                              <Plus className="w-4 h-4 mr-2" />Add Social Link
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <hr className="border-gray-700 my-4 mx-2" />
  
                          <div>
                              <h3 className="text-xs font-bold text-gray-400 mb-2">SHARE MY PROFILE</h3>
                              <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                      <div>
                                          <button onClick={copyToClipboard} className="flex bg-gray-700 text-white text-xs rounded-full px-3 w-34 py-1">
                                              Copy to Clipboard
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <hr className="border-gray-700 my-4 mx-2" />
  
                          <div>
                              <h3 className="text-xs font-bold text-gray-400 mb-2">DELETE ACCOUNT</h3>
                              <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                      <button 
                                          onClick={deleteAccount} 
                                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full"
                                      >
                                          Delete account
                                      </button>
                                  </div>
                              </div>
                          </div>
                          </>
    );
  }
  
  export default ProfileCard;
  