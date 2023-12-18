import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import Nav from './components/Nav';
import logo from './img/icon1.png';
import Table from './components/Table';
import Modal from 'react-modal';

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate('/chatbot');
  };
  const modalContents = () => {
    return (
      <div className='modal-container'>
        {/*도움말 컨텐츠*/}
        <Nav/>
        <div className='precaution'>
          <h2>** 주의사항 **</h2>
          
        </div>
        <button className="enter-button" onClick={handleEnter}>click</button>

      </div>
    )
  }

  var welcomt_msg = "데이터분석기초 챗봇에 오신걸 환영합니다 🎈\n저는 여러분의 수업을 도와줄 챗봇 DAC라고 합니다.\n 잘 부탁드립니다 :)";
  var iCampus_link = "https://canvas.skku.edu/courses/46987";

  return (
    <div>
      <Nav/>
      <div className="home-container">
        <div className="logo">
          <img className='logoImage' src={logo} width='450' height='300' />
        </div>
        {/* <div className="site-name">Site Name</div> */}
        <div className="welcome-message">{welcomt_msg}</div>
        <div className='table'>
          <button className="enter-button" onClick={(e) => {
            window.open(iCampus_link);
          }}>i-Campus</button>
          {/* <button className="enter-button" onClick={handleEnter}>입장하기</button> */}
          <button className="enter-button" onClick={()=> setModalIsOpen(true)}>입장하기</button>
          <Modal isOpen={modalIsOpen} onRequestClose={()=> setModalIsOpen(false)}>
            <div className='modal-container'>
              {/*도움말 컨텐츠*/}
              <Nav/>
              <div className='precaution'>
                <h2 className='emphasis'>** 주의사항 **</h2>
                <li>무분별한 챗봇 사용은 자제해주세요(고장납니다!).</li>
                <li>챗봇에는 필요한 내용만 질문해주세요!</li>
              </div>
              
              <button className="enter-button" onClick={handleEnter}>Next</button>

            </div>
            <modalContents/>
          </Modal>
        </div>
        
      </div>
    </div>
    
  );
};

export default Home;