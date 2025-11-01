import React, { useState, useEffect } from 'react';
// (◀◀◀ 1. MUI 컴포넌트들을 import 합니다)
import { 
  Container, Typography, Box, Grid, Card, 
  CardContent, CardActions, Button, CircularProgress, Alert 
} from '@mui/material';

function MyPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // (useEffect 부분은 변경 없음)
  useEffect(() => {
    const fetchMyBookings = async () => {
      // ... (기존 fetchMyBookings 함수 내용) ...
      // (에러 핸들링만 setError로 변경)
      const token = localStorage.getItem('token');
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:4000/api/my-bookings', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "데이터를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  // (handleCancel 부분은 변경 없음)
  const handleCancel = async (bookingId) => {
    if (!window.confirm("정말로 이 예약을 취소하시겠습니까?")) return;
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) return setError("로그인이 필요합니다.");

    try {
      const response = await fetch(`http://localhost:4000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "예약 취소에 실패했습니다.");
      }
      setBookings(currentBookings => 
        currentBookings.filter(booking => booking._id !== bookingId)
      );
      alert("예약이 취소되었습니다.");
    } catch (err) {
      setError(err.message);
    }
  };

  // (◀◀◀ 2. 로딩/에러 뷰 변경)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // (◀◀◀ 3. [수정됨!] return 부분을 MUI 컴포넌트로 변경)
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        🏀 내 예약 목록
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {bookings.length === 0 && !loading ? (
        <Typography>아직 신청한 경기가 없습니다.</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item key={booking._id} xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {/* (populate 덕분에 booking.match에 경기 정보가 있음) */}
                    {booking.match.date}
                  </Typography>
                  <Typography color="text.secondary">
                    {booking.match.location}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="outlined"
                    color="error" // (◀◀◀ 취소 버튼은 빨간색으로)
                    onClick={() => handleCancel(booking._id)}
                  >
                    예약 취소
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default MyPage;