import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Maincontent from './components/Maincontent/Maincontent'
import Footer from './components/Footer/Footer'
import 'remixicon/fonts/remixicon.css'

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Maincontent/>
      <Footer/>
    </div>
  )
}

export default App
