import './Header.scss';
import { AppBar, Box, Container, Toolbar } from '@mui/material';


const Header = () => {
  const japaneseTitle: string = "動詞力チェック";
  const englishTitle: string = "Doushiryoku Check";

  return ( 
    <nav data-cy="header" className="header">
      <AppBar color="appbarBlue">
        <Container maxWidth={false} sx={{ paddingLeft: '6px', paddingRight: '6px' }}>
          <Toolbar className="toolbar" disableGutters sx={{ justifyContent: 'left' }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <h1>{ japaneseTitle } / { englishTitle }</h1>
            </Box>
            <Box className="xsTitle" sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }}>
              <h1>{ japaneseTitle }</h1>
              <h2>{ englishTitle }</h2>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </nav>   
  );
}
 
export default Header;