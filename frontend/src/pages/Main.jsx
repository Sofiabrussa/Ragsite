import React from 'react';
import Navbar from '../components/Navbar';
import ChatContainer from '../components/ChatContainer';

const Main = () => {
  return (
    <div className="d-flex flex-column bg-dark text-white" style={{ height: '100vh' }}>
      <Navbar companyName="Pyplan" />
      <div className="flex-grow-1 pt-5 overflow-auto">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Main;
