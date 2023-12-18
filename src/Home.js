import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import Nav from './components/Nav';
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
    width: '1000px',
    transform: 'translate(-50%, -50%)',
  },
};

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate('/chatbot');
  };

  const modalContents = () => {
    var contents = 
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
    return (
      {contents}
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
          <Modal isOpen={modalIsOpen} onRequestClose={()=> setModalIsOpen(false)} style={modalStyles}>
            <div className='modal-container'>
              {/*도움말 컨텐츠*/}
              <Nav/>
              <div className='precaution'>
                <h2 className='emphasis'>** 주의사항 **</h2>
                <li className='content'>무분별한 챗봇 사용은 자제해주세요.</li>
                <li className='content'>챗봇에는 수업과 관련된 내용만 질문해주세요!</li>
                <li className='content'>챗봇은 PC에서 실행해주세요 :)</li>
              </div>
              <div className='tips'>
                <h2 className='emphasis'>** 사용 Tip **</h2>
                <li className='content'>'무엇'으로 '어떤' 것을 하고 싶은지 명시하면 원하는 답변을 더 쉽게 얻을 수 있습니다.</li>
                <img className='logoImage' src={ex_png} width='800' height='360'/>
                <li className='content'>질문 내역을 지우고 싶다면 왼쪽 위의 빨간색 Clean버튼을 눌러주세요!</li>
                <li className='content'>챗봇에 에러가 발생했다면, 조교님께 말씀주세요 :)</li>
              </div>
              <div className='button-area'>
                <button className="enter-button" onClick={()=> setModalIsOpen(false)}>Back</button>
                <button className="enter-button" onClick={handleEnter}>Start</button>
              </div>
            </div>
          </Modal>
        </div>
        
      </div>
    </div>
    
  );
};

export default Home;