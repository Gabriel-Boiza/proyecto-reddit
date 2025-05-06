import Header from "../../layouts/header";
import Aside from "../../layouts/aside";
import React, { useState, useRef, useEffect } from 'react';
import axios from "axios"

function CreatePost() {
  const [activeTab, setActiveTab] = useState('text');
  const [imagePreview, setImagePreview] = useState(null);
  const [activeFormats, setActiveFormats] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const editorRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanContent = cleanHTML(editorContent);

    const postData = {
      title,
      description: activeTab === 'text' ? cleanContent : '',
      type: activeTab,
      file_url: imageFile
    };

    axios.post("http://localhost:3000/createPost", postData, {
      withCredentials: true
    })
    .then(response => {
      console.log(response.data);
      
    })
    .catch(error => {
      console.log("no");

    });
    
  };

  const execFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateActiveFormats();
    setEditorContent(editorRef.current.innerHTML);
  };

  const insertTable = () => {
    const tableHTML = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <tr><td style="padding: 4px;">Cell 1</td><td style="padding: 4px;">Cell 2</td></tr>
        <tr><td style="padding: 4px;">Cell 3</td><td style="padding: 4px;">Cell 4</td></tr>
      </table>`;
    execFormat('insertHTML', tableHTML);
  };

  const updateActiveFormats = () => {
    const formats = ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'];
    const current = formats.filter(fmt => document.queryCommandState(fmt));
    setActiveFormats(current);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos .png, .jpg o .jpeg');
      e.target.value = null;
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const cleanHTML = (html) => {
    return html.replace(/dir=["']?rtl["']?/gi, '');
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveFormats);
    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, []);

  useEffect(() => {
    if (activeTab === 'text' && editorRef.current) {
      editorRef.current.innerHTML = editorContent;
    }
  }, [activeTab, editorContent]);

  const isActive = (cmd) => activeFormats.includes(cmd);

  return (
    <>
      <Header />
      <Aside />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="min-h-screen p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create post</h1>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              {['text', 'image'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 mr-2 font-medium ${
                    activeTab === tab ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {tab === 'text' ? 'Text' : 'Images & Video'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title*"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                maxLength={300}
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {activeTab === 'text' && (
                <>
                  {/* Toolbar */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => execFormat('bold')} className={`px-2 py-1 border rounded ${isActive('bold') ? 'bg-blue-200' : ''}`}>B</button>
                    <button type="button" onClick={() => execFormat('italic')} className={`px-2 py-1 border rounded italic ${isActive('italic') ? 'bg-blue-200' : ''}`}>I</button>
                    <button type="button" onClick={() => execFormat('underline')} className={`px-2 py-1 border rounded underline ${isActive('underline') ? 'bg-blue-200' : ''}`}>U</button>
                    <button type="button" onClick={() => execFormat('strikeThrough')} className={`px-2 py-1 border rounded line-through ${isActive('strikeThrough') ? 'bg-blue-200' : ''}`}>S</button>
                    <button type="button" onClick={() => execFormat('superscript')} className={`px-2 py-1 border rounded ${isActive('superscript') ? 'bg-blue-200' : ''}`}>x²</button>
                    <button type="button" onClick={() => execFormat('subscript')} className={`px-2 py-1 border rounded ${isActive('subscript') ? 'bg-blue-200' : ''}`}>xₙ</button>
                    <button type="button" onClick={insertTable} className="px-2 py-1 border rounded">Tabla</button>
                  </div>

                  {/* Editor */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
                    className="w-full h-40 p-2 border border-gray-300 rounded overflow-y-auto text-left"
                    suppressContentEditableWarning={true}
                  ></div>
                </>
              )}

              {activeTab === 'image' && (
                <>
                  <div className="border border-dashed border-gray-400 rounded p-4 text-center cursor-pointer">
                    <label className="cursor-pointer">
                      <span className="block mb-2">Sube una imagen (.png, .jpg, .jpeg)</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="Preview" className="max-w-full max-h-60 mx-auto rounded border" />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
