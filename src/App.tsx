import { FunctionComponent, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WindowContext, WindowContextProps } from './Contexts/WindowContext';
import { Links as links } from './utils';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import Header from './Components/Header/Header';
import { PaletteColorOptions, ThemeProvider, createTheme } from '@mui/material';


export interface IAppProps {}

declare module '@mui/material/styles' {
  interface CustomPalette {
    darkBlue: PaletteColorOptions,
    appbarBlue: PaletteColorOptions
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    darkBlue: true
  }
}
declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    appbarBlue: true
  }
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: any) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    darkBlue: createColor('#330eda'),
    appbarBlue: createColor('#8cb3ff')
  },
});

const App: FunctionComponent<IAppProps> = () => {
  const { clientHeight, clientWidth } = useContext<WindowContextProps>(WindowContext);
  let widthToSet: string = clientWidth < 1150 ? "88%" : "1000px";
  let heightToSet: string = String(clientHeight - 176) + "px";

  return (
    <ThemeProvider theme={ theme }>
      <BrowserRouter>
        <div className="App">
          <Header />
          <div className="main-content" style={{width: widthToSet, minHeight: heightToSet}}>
            <Routes>
              <Route path={ links.Home } element={ <Home/> }/>
              <Route path='*' element={ <NotFound/> }/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
