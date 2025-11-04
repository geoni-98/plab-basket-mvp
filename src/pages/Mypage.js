import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert } from '@mui/material';

const API_URL = 'https://plab-basket-server.onrender.com'; // ◀◀◀ 1. 공개 주소

function MyPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/my-bookings`, { // ◀◀◀ 2. 주소 변경
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

  const handleCancel = async (bookingId) => {
    if (!window.confirm("정말로 이 예약을 취소하시겠습니까?")) return;
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) return setError("로그인이 필요합니다.");

    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, { // ◀◀◀ 3. 주소 변경
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

  // (return 문은 변경 없음)
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>🏀 내 예약 목록</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {bookings.length === 0 && !loading ? (
        <Typography>아직 신청한 경기가 없습니다.</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item key={booking._id} xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">{booking.match.date}</Typography>
                  <Typography color="text.secondary">{booking.match.location}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleCancel(booking._id)}>
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