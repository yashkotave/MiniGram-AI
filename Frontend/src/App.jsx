import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Authentication from './pages/Authentication'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white dark:bg-gray-950">
              <Navbar />
              <Home />
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
