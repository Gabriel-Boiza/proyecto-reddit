import React, { useState, useRef } from 'react';
import axios from 'axios';
import Header from '../../layouts/header';
import Aside from '../../layouts/aside';
import { domain } from '../../context/domain';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function EditProfile() {
  const [activeTab, setActiveTab] = useState('info');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    if (password && confirmPassword) {
      formData.append('password', password);
    }
    if (imageFile) {
      formData.append('file', imageFile);
    }
    console.log(formData)
    try {
      const response = await axios.put(`${domain}updateProfile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/profile'); // Redirige a la página del perfil después de actualizar

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      alert('Solo se permiten imágenes PNG, JPG o JPEG.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${domain}getUserByCookie`, {
          withCredentials: true,
        });

        const { name, username } = res.data.user;
        setName(name || '');
        setUsername(username || '');
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-[#14181a]">
      <Header />
      <div className="pt-16"> {/* Add padding-top for fixed header */}
        <Aside />
        <div className="flex">
          <main className="content w-full p-4 md:ml-80">
            <div className="max-w-2xl mx-auto bg-[#1e1e1e] rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

              <div className="flex border-b mb-4">
                {['info', 'password', 'image'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 mr-2 ${
                      activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {tab === 'info' ? 'Información' : tab === 'password' ? 'Contraseña' : 'Imagen'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {activeTab === 'info' && (
                  <>
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-2 border rounded mb-4"
                    />

                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full p-2 border rounded mb-4"
                    />
                  </>
                )}

                {activeTab === 'password' && (
                  <>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded mb-4"
                    />

                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded mb-4"
                    />
                  </>
                )}

                {activeTab === 'image' && (
                  <>
                    <label className="block border border-dashed rounded p-4 text-center cursor-pointer">
                      <span>Sube una nueva imagen de perfil (.png, .jpg, .jpeg)</span>
                      <input type="file" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {imagePreview && <img src={imagePreview} alt="preview" className="mt-4 max-w-full max-h-60 mx-auto" />}
                  </>
                )}

                <div className="mt-4 text-right">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
