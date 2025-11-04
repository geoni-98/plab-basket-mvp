import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Card, CardContent, CardActions, Grid, CircularProgress, Alert } from '@mui/material';

const API_URL = 'https://plab-basket-server.onrender.com'; // ◀◀◀ 1. 공개 주소

function HomePage({ user }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetch(`${API_URL}/api/matches`) // ◀◀◀ 2. 주소 변경
      .then(response => response.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(error => {
        setError("경기 목록을 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('token'); 
    if (!token) return setError("로그인이 필요합니다.");

    const newMatch = { date, location, price: 10000, current: 0, total: 10 };
    fetch(`${API_URL}/api/matches`, { // ◀◀◀ 3. 주소 변경
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newMatch),
    })
      .then(response => response.json())
      .then(addedMatch => {
        setMatches([...matches, addedMatch]);
        setDate('');
        setLocation('');
      })
      .catch(error => setError(error.message || "경기 등록에 실패했습니다."));
  };

  const handleApply = (matchId) => {
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) return setError("로그인이 필요합니다.");
    
    fetch(`${API_URL}/api/matches/${matchId}/apply`, { // ◀◀◀ 4. 주소 변경
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) return response.json().then(err => Promise.reject(err));
        return response.json();
      })
      .then(updatedMatch => {
        setMatches(currentMatches =>
          currentMatches.map(match =>
            match._id === updatedMatch._id ? updatedMatch : match
          )
        );
      })
      .catch(error => setError(error.message || "신청 중 오류가 발생했습니다."));
  };

  // (return 문은 변경 없음)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {user && user.role === 'admin' && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>(관리자) 새 경기 등록</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}><TextField fullWidth label="날짜 및 시간" value={date} onChange={(e) => setDate(e.target.value)} /></Grid>
            <Grid item xs={12} sm={5}><TextField fullWidth label="장소" value={location} onChange={(e) => setLocation(e.target.value)} /></Grid>
            <Grid item xs={12} sm={2}><Button type="submit" variant="contained" fullWidth sx={{ height: 56 }}>등록</Button></Grid>
          </Grid>
        </Box>
      )}
      <Typography variant="h4" gutterBottom>🔥 진행 중인 경기</Typography>
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item key={match._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">{match.date}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">{match.location}</Typography>
                <Typography variant="body1">신청 현황: {match.current} / {match.total} 명</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" onClick={() => handleApply(match._id)} disabled={match.current >= match.total}>
                  {match.current >= match.total ? "마감" : "신청하기"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
export default HomePage;