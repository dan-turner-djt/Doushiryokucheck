import { FunctionComponent, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WindowContext, WindowContextProps } from './Contexts/WindowContext';
import { Links as links } from './utils';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import Header from './Components/Header/Header';


export interface IAppProps {}

const App: FunctionComponent<IAppProps> = (props) => {
  const navbarTitle: string = "動詞力チェック / Doushiryoku Check";
  const navbarItems: {name: string, link: string}[]  = [
    //{ name: "Home", link: links.Home }
  ];

  const { clientHeight, clientWidth } = useContext<WindowContextProps>(WindowContext);
  let widthToSet = !clientWidth? "60%" : (clientWidth < 1100 ? "60%" : "1100px");

  return (
    <BrowserRouter>
      <div className="App">
        <Header title={ navbarTitle } items={ navbarItems } />
        <div className="main-content" style={{width: widthToSet}}>
          <Routes>
            <Route path={ links.Home } element={ <Home/> }/>
            <Route path='*' element={ <NotFound/> }/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
