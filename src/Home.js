import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/chatbot');
  };

  return (
    <div className="home-container">
      <div className="logo">Logo</div>
      <div className="site-name">Site Name</div>
      <div className="welcome-message">Welcome Message</div>
      <button className="enter-button" onClick={handleEnter}>입장하기</button>
    </div>
  );
};

export default Home;