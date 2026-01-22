import { useState } from 'react';
import PostForm from '../components/PostForm';
import { Plus } from 'lucide-react';

export default function Home() {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="text-center mb-16 sm:mb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
          Welcome to <span className="gradient-text">MiniGram</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
          Share your moments with the world and connect with millions of creators
        </p>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="group relative bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl overflow-hidden cursor-pointer aspect-square sm:aspect-video lg:aspect-square shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105"
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl font-bold mb-3">{item}</div>
                <p className="text-base font-medium">Featured Post</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-3xl px-8 sm:px-12 py-16 sm:py-20 text-center text-white mb-12 shadow-elevated">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">Ready to share your story?</h2>
        <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-pink-100 max-w-2xl mx-auto">
          Join thousands of creators and build your community on MiniGram
        </p>
        <a
          href="/auth"
          className="inline-block px-10 py-4 bg-white text-pink-600 font-bold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-lg"
        >
          Get Started
        </a>
      </div>
    </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsPostFormOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full shadow-elevated hover:shadow-lg transition-all duration-200 flex items-center justify-center z-40 hover:scale-110 transform"
        title="Create a new post"
        aria-label="Create a new post"
      >
        <Plus size={32} />
      </button>

      {/* Post Form Modal */}
      <PostForm isOpen={isPostFormOpen} onClose={() => setIsPostFormOpen(false)} />
    </>
  );
}
