import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import MainPage from './pages/MainPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import TrainerPage from './pages/TrainerPage'
import PrivacyPage from './pages/PrivacyPage'
import OfferPage from './pages/OfferPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/service/:id" element={<ServiceDetailPage />} />
            <Route path="/trainer" element={<TrainerPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/offer" element={<OfferPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App