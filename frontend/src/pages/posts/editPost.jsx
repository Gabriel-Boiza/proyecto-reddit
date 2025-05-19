import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from '../../layouts/header';
import Aside from '../../layouts/aside';
import { domain } from '../../context/domain';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
  const [activeTab, setActiveTab] = useState('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${domain}getPostById/${id}`, {
          withCredentials: true
        });

        const postData = response.data;
        setTitle(postData.title);
        setDescription(postData.description);

        if (postData.file_url) {
          setImagePreview(`${domain}uploads/${postData.file_url}`);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'text' && descriptionRef.current) {
      descriptionRef.current.innerHTML = description;
    }
  }, [activeTab, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('file', imageFile);
    }

    try {
      await axios.put(`${domain}updatePost/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
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

  if (loading) {
    return (
      <>
        <Header />
        <Aside />
        <div className="p-6 max-w-2xl mx-auto">
          <p>Cargando datos del post...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Aside />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit post</h1>

        <div className="flex border-b mb-4">
          {['text', 'image'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-2 ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              {tab === 'text' ? 'Text' : 'Images & Video'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          />

          {activeTab === 'text' && (
            <div
              ref={descriptionRef}
              contentEditable
              onInput={(e) => setDescription(e.target.innerHTML)}
              className="w-full h-40 p-2 border rounded overflow-y-auto"
              suppressContentEditableWarning
            ></div>
          )}

          {activeTab === 'image' && (
            <>
              <label className="block border border-dashed rounded p-4 text-center cursor-pointer">
                <span>Sube una imagen (.png, .jpg, .jpeg)</span>
                <input type="file" onChange={handleImageUpload} className="hidden" />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="mt-4 max-w-full max-h-60 mx-auto"
                />
              )}
            </>
          )}

          <div className="mt-4 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPost;
