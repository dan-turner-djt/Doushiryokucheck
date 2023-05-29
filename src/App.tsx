import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WindowContext, WindowContextProvider } from './Contexts/WindowContext';
import { Links as links } from './utils';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import './App.css';
import Navbar from './Components/Navbar';


export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const navbarTitle: string = "動詞力チェック / Doushiryoku Check";
  const navbarItems: {name: string, link: string}[]  = [
    { name: "Home", link: links.Home }
  ];

  const { clientHeight, clientWidth } = useContext(WindowContext);
  let widthToSet = !clientWidth? "60%" : (clientWidth < 1100 ? "60%" : "1100px");

  return (
    <WindowContextProvider>
        <BrowserRouter>
          <div className="App">
            <Navbar title={ navbarTitle } items={ navbarItems } />
            <div className="main-content" style={{width: widthToSet}}>
              <Routes>
                <Route path={ links.Home } element={ <Home/> }/>
                <Route path='*' element={ <NotFound/> }/>
              </Routes>
            </div>
          </div>
        </BrowserRouter>
    </WindowContextProvider>
  );
}

export default App;
