import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';

const API_URL = 'https://plab-basket-server.onrender.com'; // ◀◀◀ 1. 공개 주소

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    try {
      const response = await fetch(`${API_URL}/api/users/register`, { // ◀◀◀ 2. 주소 변경
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }
      alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
      navigate('/login'); 
    } catch (err) {
      setError(err.message);
    }
  };

  // (return 문은 변경 없음)
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">회원가입</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="이메일 주소" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="비밀번호" type="password" id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>가입하기</Button>
          {error && (<Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>)}
          <Grid container justifyContent="flex-end">
            <Grid item><Link to="/login" variant="body2">{"이미 계정이 있으신가요? 로그인"}</Link></Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
export default RegisterPage;