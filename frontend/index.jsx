import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"

import './index.css'
import Home from './pages/Home.jsx'
import Build from './pages/Build.jsx'
import Run from './pages/Run.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/build' element={<Build />} />
        <Route path='/run' element={<Run />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
 <App />
)
