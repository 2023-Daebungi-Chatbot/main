import React, { useState } from 'react';
import {useEffect, useRef} from 'react';
import './Chatbot.scss';
import { Link } from 'react-router-dom';

const api_key = process.env.REACT_APP_OPENAI_API_KEY; // API 키 환경 변수에서 로드

const Message = ({ isUser, text }) => (
  <div className={`message ${isUser ? 'user' : 'gpt'}`}>{text}</div>
);

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null); // 스크롤 이동을 위한 ref 생성
  
    useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [messages]);
  
    return (
      <div className="message-list">
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser} text={msg.text} />
        ))}
        <div ref={messagesEndRef} /> {/* 스크롤 이동을 위한 빈 div */}
      </div>
    );
  };

const InputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="input-box">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <SendButton onSend={handleSend} />
    </div>
  );
};

const SendButton = ({ onSend }) => (
  <button onClick={onSend} className="send-button">
    Send
  </button>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [summaries, setSummaries] = useState([]);
  const [shouldFetchSummary, setShouldFetchSummary] = useState(false);

  const handleSendMessage = async (text) => {
    if (text.trim()) {
      const newMessages = [...messages, { text, isUser: true }];
      setMessages(newMessages);
      setIsLoading(true);

      const chatMessages = newMessages.map((m) => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text,
      }));

      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: newMessages.map(m => ({role: m.isUser ? 'user' : 'assistant', content: m.text})),
        //max_tokens: 300,
      };
  
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + api_key,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          const updatedMessages = [...newMessages, { text: data.choices[0].message.content, isUser: false }];
          setMessages(updatedMessages);
          setShouldFetchSummary(true);
          localStorage.setItem('chatMessages', JSON.stringify([...newMessages, { text: data.choices[0].message.content, isUser: false }]));
        } else {
          // API로부터 유효한 응답을 받지 못했을 때 처리
          console.error('Invalid response from the API:', data);
        }
      } catch (error) {
        // 네트워크 오류 또는 요청 실패 시 처리
        console.error('Error sending message:', error);
      }

      setIsLoading(false);
    }

    
  };

  const lastMessage = messages[messages.length -1]?.text;

  const fetchSummary = async () => {
    setSummaries(prevSummaries => [...prevSummaries, {loading: true, text: "요약을 생성중입니다.."}]);
    const summaryMessages = [{
      role: 'assistant',
      content: `${lastMessage}를 3 문장 이내로 요약해줘.`
    }];
  
    const summaryRequestBody = {
      model: "gpt-3.5-turbo",
      messages: summaryMessages,
      //max_tokens: 150,
    };

    try {
      const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer "+ api_key,
        },
        body: JSON.stringify(summaryRequestBody),
      });

      const summaryData = await summaryResponse.json();

      if (summaryData.choices && summaryData.choices.length > 0 && summaryData.choices[0].message) {
        // 요약 상태 업데이트
        setSummaries(prevSummaries => {
          const updatedSummaries = prevSummaries.map((summary, index) => 
            index === prevSummaries.length - 1 
              ? { loading: false, text: summaryData.choices[0].message.content }
              : summary
          );
          // 로딩 메시지를 제외한 상태를 로컬 스토리지에 저장
          localStorage.setItem('chatSummaries', JSON.stringify(updatedSummaries.filter(s => !s.loading)));
          return updatedSummaries;
        });
      } else{
        console.error('Invalid response from summary API:',summaryData);
      }
    } catch(error){
      console.error('Error sending summary Message: ',error);
    }
  };

  const clearAll = () => {
    setMessages([]);
    setSummaries([]);

    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatSummaries');
  };

  useEffect(() => {
    // 대화 내용 로드
    const savedMessages = localStorage.getItem('chatMessages');
    if(savedMessages){
      setMessages(JSON.parse(savedMessages));
    }

    // 요약 카드 로드
    const savedSummaries = localStorage.getItem('chatSummaries');
    if (savedSummaries) {
      setSummaries(JSON.parse(savedSummaries));
    }
  }, []);
  
  useEffect(() => {
    if(shouldFetchSummary && messages.length > 0){
      const lastMessageText = messages[messages.length -1].text;
      fetchSummary(lastMessageText);
      setShouldFetchSummary(false);
    }
  }, [messages, shouldFetchSummary]);


  return (
    <div className="chatbot">
      <div className="nav">
      <Link to="/">Home</Link>
      <br></br>
      <button onClick={clearAll} className="clear-button">Clean</button>
      </div>
    <div className="chat-container">
      <MessageList messages={messages} />
      <InputBox onSendMessage={handleSendMessage} />
      {isLoading && <div className="loading">답변을 생성중입니다...</div>}
    </div>
      <div className="summary-container">
        {summaries.map((summary, index) => (
          <div className="summary" key={index}>
            <h4>GPT 답변 요약 - {index+1} </h4>
            <p>{summary.loading ? summary.text : summary.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;