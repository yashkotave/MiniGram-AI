import { useState } from 'react';
import { X, Image as ImageIcon, Loader } from 'lucide-react';

export default function PostForm({ isOpen, onClose }) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!caption.trim() && !selectedFile) {
      setError('Please add a caption or select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Reset form
      setCaption('');
      setSelectedFile(null);
      setPreview(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create a New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X size={26} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Preview */}
          {preview && (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-96 object-cover rounded-2xl shadow-card"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="absolute top-4 right-4 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* File Upload */}
          {!preview && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-900/10 transition-all duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <ImageIcon size={56} className="text-slate-400 mb-3 opacity-80" />
                <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  PNG, JPG, GIF up to 5MB
                </p>
              </label>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
              Caption <span className="text-pink-500">*</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for your post..."
              maxLength={2000}
              rows={5}
              className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {caption.length}/2000 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-700 dark:text-red-400 text-sm font-semibold">⚠️ {error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
