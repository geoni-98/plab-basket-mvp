import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// (◀◀◀ 1. [새로 추가!] MUI 컴포넌트들을 import 합니다)
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }
      
      onLogin(data.token, data.user); 
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  // (◀◀◀ 2. [수정됨!] return 부분을 MUI 컴포넌트로 변경)
  return (
    // 'Container'는 내용을 적절한 최대 너비로 감싸줍니다.
    <Container component="main" maxWidth="xs"> 
      {/* 'Box'는 CSS 유틸리티를 편하게 쓰게 해줍니다. (div 같은) */}
      <Box
        sx={{
          marginTop: 8, // 위쪽 여백
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // 가운데 정렬
        }}
      >
        {/* 'Typography'는 텍스트(h1, p 등)를 의미합니다. */}
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        
        {/* 'Box'를 form 태그처럼 사용, 'noValidate'는 브라우저 기본 검증 끔 */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* 'TextField'는 input입니다. */}
          <TextField
            margin="normal" // 위아래 적절한 여백
            required // 필수
            fullWidth // 가로 꽉 차게
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            autoFocus // 페이지 열리면 자동 포커스
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {/* 'Button'입니다. variant="contained"는 색이 채워진 기본 버튼 */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }} // mt: margin-top, mb: margin-bottom
          >
            로그인
          </Button>

          {/* 에러가 있을 때만 'Alert' 컴포넌트를 보여줌 */}
          {error && (
            <Alert severity="error">{error}</Alert>
          )}

        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;