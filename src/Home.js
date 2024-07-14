import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import Nav from './components/Nav';
import Footer from './components/Footer';
import logo from './img/icon1.png';
import ex_png from './img/example_1.png'
import Table from './components/Table';
import Modal from 'react-modal';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '600px',
    transform: 'translate(-50%, -50%)',
  },
};

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate('/chatbot');
  };
  const welcome_mag = "논문쓰기 챗봇에 오신걸 환영합니다 🎈\n저는 여러분의 수업을 도와줄 챗봇입니다."
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);

  useEffect(()=> {
    const interval = setInterval(()=> {
      setText(text + welcome_mag[count]);
      setCount(count + 1);
    }, 50);
    if(count === welcome_mag.length){
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  })

  var iCampus_link = "https://canvas.skku.edu/courses/52423";

  return (
    <div>
      <Nav/>
      <div className="home-container">
        <div className="logo">
          <img className='logoImage' src={logo} width='300' height='300' />
        </div>
        {/* <div className="site-name">Site Name</div> */}
        <div className="welcome-message">{text}</div>
        <div className='table'>
          <button className="enter-button" onClick={(e) => {
            window.open(iCampus_link);
          }}>i-Campus</button>
          {/* <button className="enter-button" onClick={handleEnter}>입장하기</button> */}
          <button className="enter-button" onClick={()=> setModalIsOpen(true)}>입장하기</button>
          <Modal isOpen={modalIsOpen} onRequestClose={()=> setModalIsOpen(false)} style={modalStyles}>
            <div className='modal-container'>
              {/*도움말 컨텐츠*/}
              <Nav/>
              <div className='precaution'>
                <h2 className='emphasis'>** 주의사항 **</h2>
                <li className='content'>챗봇에는 수업과 관련된 내용만 질문해주세요!</li>
                <li className='content'>챗봇 사용내역은 서버에 저장됩니다.</li>
                <li className='content'>챗봇은 PC에서 실행해주세요 :)</li>
              </div>
              <div className='tips'>
                <h2 className='emphasis'>** 사용 Tip **</h2>
                <li className='content'>원하는 바를 명시하면 원하는 답변을 쉽게 얻을 수 있습니다.</li>
                <img className='logoImage' src={ex_png} width='600' height='270'/>
                <li className='content'>빨간색 Clean버튼을 누르면 내용이 지워집니다!</li>
                <li className='content'>챗봇에 에러가 발생했다면, 조교님께 말씀주세요 :)</li>
              </div>
              <div className='button-area'>
                <button className="enter-button" onClick={()=> setModalIsOpen(false)}>Back</button>
                <button className="enter-button" onClick={handleEnter}>Start</button>
              </div>
            </div>
          </Modal>
        </div>
        <Footer/>
      </div>
    </div>
    
  );
};

export default Home;