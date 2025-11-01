import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/Mypage';

function App() {
  // 1. (수정됨!) localStorage에서 'user' 객체를 통째로 불러옴
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // 2. (수정됨!) handleLogin - user 객체를 저장
  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // ◀◀ user 객체 저장
    setUser(userData);
  };

  // 3. (수정됨!) handleLogout - user 객체를 삭제
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ◀◀ user 객체 삭제
    setUser(null);
  };

  // 'isLoggedIn'은 이제 'user' 객체가 있는지(true) 없는지(false)로 판단
  const isLoggedIn = !!user; 

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main>
        <Routes>
          {/* 4. (수정됨!) HomePage에 user 정보를 props로 전달 */}
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;