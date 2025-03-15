import React from 'react'
import Chat from './components/Chat'
import Stats from './components/Stats'

function App() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='w-1/2 h-full bg-black'>
        <Stats />
      </div>
      <div className='w-1/2 h-full'>
        <Chat />
      </div>
    </div>
  )
}

export default App