import { useState } from 'react';
import PostForm from '../components/PostForm';
import { Plus } from 'lucide-react';

export default function Home() {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Welcome to MiniGram
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
          Share your moments with the world
        </p>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="group relative bg-gradient-to-br from-pink-400 to-orange-400 rounded-xl overflow-hidden cursor-pointer aspect-square sm:aspect-video lg:aspect-square"
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl font-bold mb-2">{item}</div>
                <p className="text-sm">Featured Post</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl px-6 sm:px-8 py-12 sm:py-16 text-center text-white mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to share your story?</h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-pink-100">
          Join thousands of creators and build your community on MiniGram
        </p>
        <a
          href="/auth"
          className="inline-block px-8 py-3 bg-white text-pink-600 font-bold rounded-lg hover:shadow-lg transition-shadow"
        >
          Get Started
        </a>
      </div>
    </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsPostFormOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40 hover:scale-110 transform duration-200"
        title="Create a new post"
      >
        <Plus size={28} />
      </button>

      {/* Post Form Modal */}
      <PostForm isOpen={isPostFormOpen} onClose={() => setIsPostFormOpen(false)} />
    </>
  );
}
