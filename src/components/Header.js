import React from 'react';
// (◀◀◀ 1. 'Link'의 이름 충돌을 피하기 위해 'RouterLink'로 불러옵니다)
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// (◀◀◀ 2. MUI 컴포넌트들을 import 합니다)
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball'; // (◀◀◀ 아이콘)

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    // 'AppBar'가 파란색 상단 바입니다.
    <AppBar position="static"> 
      {/* 'Toolbar'는 AppBar 안의 내용물을 가로로 정렬해 줍니다. */}
      <Toolbar>
        <SportsBasketballIcon sx={{ mr: 1 }} /> {/* 3. 아이콘 추가 */}
        
        {/* 'Typography'는 텍스트입니다. variant="h6"는 'h6' 태그 정도의 크기 */}
        <Typography 
          variant="h6" 
          component={RouterLink} // 4. React Router의 Link로 작동
          to="/" 
          sx={{ 
            color: 'inherit', // (AppBar가 파란색이니) 글자색은 흰색(inherit)
            textDecoration: 'none' // 링크 밑줄 제거
          }}
        >
          플랩바스켓
        </Typography>

        {/* (◀◀◀ 5. 이 Box가 오른쪽 버튼들을 맨 끝으로 밀어냅니다) */}
        <Box sx={{ flexGrow: 1 }} /> 

        {isLoggedIn ? (
          // (◀◀◀ 6. <Link> 대신 MUI의 <Button>을 사용)
          <>
            <Button color="inherit" component={RouterLink} to="/mypage">
              마이페이지
            </Button>
            <Button color="inherit" onClick={handleLogoutClick}>
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              로그인
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              회원가입
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;