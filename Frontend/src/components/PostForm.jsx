import { useState, useRef } from 'react';
import { Upload, Sparkles, Loader, X, Copy, RefreshCw } from 'lucide-react';
import { aiService, postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostForm({ onPostCreated }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [imageDescription, setImageDescription] = useState('');
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const generateAiCaption = async () => {
    if (!imageDescription.trim()) {
      setError('Please describe the image to generate a caption');
      return;
    }

    setAiLoading(true);
    setError('');
    try {
      const response = await aiService.generateCaptionSuggestions(imageDescription);
      if (response.success) {
        setAiSuggestions(response.suggestions);
        setShowAiSuggestions(true);
        setSuccess('AI captions generated!');
      }
    } catch (error) {
      setError('Failed to generate captions: ' + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const useAiCaption = (aiCaption) => {
    setCaption(aiCaption);
    setShowAiSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!caption.trim()) {
      setError('Caption is required');
      return;
    }
    if (!imageUrl) {
      setError('Image is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await postService.createPost(
        caption,
        imageUrl,
        tags,
        aiSuggestions.length > 0,
        imageDescription
      );

      if (response.success) {
        setCaption('');
        setImageUrl('');
        setImagePreview('');
        setTags([]);
        setTagInput('');
        setImageDescription('');
        setAiSuggestions([]);
        setSuccess('Post created successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
        
        if (onPostCreated) {
          onPostCreated(response.post);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
        Create New Post
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
          <X size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Upload Image
          </label>
          {imagePreview ? (
            <div className="relative mb-4">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setImageUrl('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:border-pink-500 dark:hover:border-pink-400 transition-colors"
            >
              <Upload size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                PNG, JPG, GIF up to 50MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Image Description for AI */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Image Description (for AI caption)
          </label>
          <input
            type="text"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Describe what's in your image..."
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* AI Caption Generation */}
        <div>
          <button
            type="button"
            onClick={generateAiCaption}
            disabled={aiLoading || !imageDescription.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {aiLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate AI Captions
              </>
            )}
          </button>

          {showAiSuggestions && aiSuggestions.length > 0 && (
            <div className="mt-4 space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                AI Suggestions:
              </h4>
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => useAiCaption(suggestion)}
                  className="w-full text-left p-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-pink-500 dark:hover:border-pink-400 transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Caption {caption.length}/2000
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something inspiring..."
            maxLength={2000}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Add Tags
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tags (press Enter)"
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Post'
          )}
        </button>
      </form>
    </div>
  );
}
