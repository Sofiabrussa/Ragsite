import React from 'react';
import Navbar from '../components/Navbar';
import ChatContainer from '../components/ChatContainer';
import ParticlesBackground from '../components/ParticlesBackground';

const Main = () => {
  return (
    <div className="position-relative" style={{ height: '100vh', overflow: 'hidden' }}>
      <ParticlesBackground />
      <div className="position-relative d-flex flex-column text-white" style={{ zIndex: 1, height: '100vh' }}>
        <Navbar companyName="Pyplan" />
        <div className="flex-grow-1 pt-5 overflow-auto">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default Main;