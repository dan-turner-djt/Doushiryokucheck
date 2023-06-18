import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WindowContext, WindowContextProps } from "../../Contexts/WindowContext";

const Header = ({ title, items }: { title: string, items: {name: string, link: string}[]}) => {
  const { clientHeight, clientWidth } = useContext<WindowContextProps>(WindowContext);
  const isMobile = (clientHeight > clientWidth);
  const navigator = useNavigate();

  const cleanupBeforeNav = () => {
    resetScroll();
  }

  const resetScroll = () => {
    window.scrollTo(0,0);
  }

  const renderFullMode = () => {
    return <nav className="navbar-full">
      <h1>{ title }</h1>
      <span className="links">
        <span>
          {items.map((item) => (
            <span className="item" key={ item.name }>
              <Link onClick={cleanupBeforeNav} to={ item.link }>{ item.name }</Link>
            </span>
          ))}
        </span>
      </span>
    </nav>
  }

  const renderMobileModeLinks = () => {
    const subItems2 = items.slice(0);
    const subItems1 = subItems2.splice(0, 4);
    return (
      <div className="split-links">
        <div>
          {subItems1.map((item) => (
            <span className="item" key={ item.name }>
              <Link onClick={cleanupBeforeNav} to={ item.link }>{ item.name }</Link>
            </span>
          ))}
        </div>
        <div>
          {subItems2.map((item) => (
            <span className="item" key={ item.name }>
              <Link onClick={cleanupBeforeNav} to={ item.link }>{ item.name }</Link>
            </span>
          ))}
        </div>
      </div>
    )
  }

  const renderMobileMode = () => {
    return <nav className="navbar-mobile">
      <div style={{display: "flex", justifyContent: "flex-start", marginBottom: "10px", alignItems: "center"}}>
        <h1 style={{flex: "0 1 auto", left: "50%", transform: "translateX(-50%)", position: "absolute"}}>{ title }</h1>
      </div>
      <div className="links">
        { renderMobileModeLinks() }
      </div>
    </nav>
  }
  

  return ( 
    <nav className="navbar">
      {!isMobile && renderFullMode()}
      {isMobile && renderMobileMode()}
    </nav>   
  );
}
 
export default Header;