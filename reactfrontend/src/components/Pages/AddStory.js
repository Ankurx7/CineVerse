import React, { useRef, useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../ReactContext/UserData";
import { AiOutlineUpload } from 'react-icons/ai';
import { FiArrowLeft } from 'react-icons/fi';

const AddStory = () => {
  const { config } = useContext(AuthContext);
  const imageEl = useRef(null);
  const editorEl = useRef(null);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const clearInputs = () => {
    setTitle('');
    setContent('');
    setImage('');
    editorEl.current.editor.setData('');
    imageEl.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("image", image);
    formdata.append("content", content);

    try {
      const { data } = await axios.post("/story/addstory", formdata, config);
      setSuccess('Story added successfully!');
      clearInputs();
      setTimeout(() => {
        setSuccess('');
      }, 7000);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
      }, 7000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center mb-4">
        <FiArrowLeft className="mr-2" />
        Go back
      </Link>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded flex justify-between items-center">
            <span>{success}</span>
            <Link to="/" className="underline hover:text-green-800">Go home</Link>
          </div>
        )}
        <div
          className="flex items-center border border-gray-300 rounded p-3 mt-4 cursor-pointer hover:bg-gray-100"
          onClick={() => imageEl.current.click()}
        >
          <AiOutlineUpload className="text-gray-500 text-xl mr-3" />
          <div className="flex-1 text-gray-600">
            {image ? image.name : "Insert image here"}
          </div>
          <input
            name="image"
            type="file"
            ref={imageEl}
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <input
          type="text"
          required
          id="title"
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <CKEditor
          editor={ClassicEditor}
          onChange={(e, editor) => setContent(editor.getData())}
          ref={editorEl}
        />



        <button
          type="submit"
          disabled={!image}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${image ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default AddStory;
