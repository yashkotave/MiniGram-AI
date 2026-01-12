import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to MiniGram</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Share your moments with the world</p>
      </main>
    </div>
  )
}

export default App
