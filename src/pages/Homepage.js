import React, { useState, useEffect } from 'react';
// (◀◀◀ 1. 필요한 MUI 컴포넌트들을 대거 import 합니다)
import { 
  Container, Box, TextField, Button, Typography, 
  Card, CardContent, CardActions, Grid, CircularProgress, Alert
} from '@mui/material';

function HomePage({ user }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  
  // (◀◀◀ API 에러 메시지 표시용 state)
  const [error, setError] = useState(null); 

  // (useEffect, handleSubmit, handleApply 함수들은 변경 없음)
  useEffect(() => {
    fetch('http://localhost:4000/api/matches')
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
    fetch('http://localhost:4000/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newMatch),
    })
      .then(response => {
        if (!response.ok) return response.json().then(err => Promise.reject(err));
        return response.json();
      })
      .then(addedMatch => {
        setMatches([...matches, addedMatch]); // 새 경기를 맨 뒤에 추가
        setDate('');
        setLocation('');
      })
      .catch(error => setError(error.message || "경기 등록에 실패했습니다."));
  };

  const handleApply = (matchId) => {
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) return setError("로그인이 필요합니다.");
    
    fetch(`http://localhost:4000/api/matches/${matchId}/apply`, {
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

  // (◀◀◀ 2. 로딩 중일 때 MUI '원형 스피너'를 보여줌)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // (◀◀◀ 3. [수정됨!] return 부분을 MUI 컴포넌트로 변경)
  return (
    // 'Container'는 좌우 여백을 주고 중앙 정렬합니다.
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* mt: margin-top */}
      
      {/* 에러가 있으면 Alert을 보여줌 */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* 1. 관리자 폼 */}
      {user && user.role === 'admin' && (
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mb: 4, p: 3, boxShadow: 3, borderRadius: 2 }} // (그림자 효과)
        >
          <Typography variant="h5" gutterBottom>
            (관리자) 새 경기 등록
          </Typography>
          {/* 'Grid'는 반응형 격자 레이아웃을 만듭니다. */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="날짜 및 시간" value={date} onChange={(e) => setDate(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="장소" value={location} onChange={(e) => setLocation(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button type="submit" variant="contained" fullWidth sx={{ height: 56 }}>
                등록
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 2. 경기 목록 */}
      <Typography variant="h4" gutterBottom>
        🔥 진행 중인 경기
      </Typography>
      <Grid container spacing={3}>
        {matches.map((match) => (
          // xs={12} (아주 작은 화면) | sm={6} (작은 화면) | md={4} (중간 화면)
          <Grid item key={match._id} xs={12} sm={6} md={4}>
            {/* 'Card'가 각 경기 항목입니다. */}
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* 'CardContent'는 카드 내용 */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">
                  {match.date}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {match.location}
                </Typography>
                <Typography variant="body1">
                  신청 현황: {match.current} / {match.total} 명
                </Typography>
              </CardContent>
              {/* 'CardActions'는 카드 하단 버튼 영역 */}
              <CardActions>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => handleApply(match._id)}
                  // (◀◀◀ 4. 마감되면 버튼 비활성화)
                  disabled={match.current >= match.total} 
                >
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