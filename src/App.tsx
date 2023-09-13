import { FunctionComponent, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WindowContext, WindowContextProps } from "./Contexts/WindowContext";
import { Links as links } from "./utils";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Header from "./Components/Header/Header";
import { PaletteColor, ThemeProvider, createTheme } from "@mui/material";
import { getWidth } from "./Utils/Screen";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    darkBlue?: PaletteColor,
		appbarBlue?: PaletteColor
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    darkBlue: true
  }
}
declare module "@mui/material/AppBar" {
  interface AppBarPropsColorOverrides {
    appbarBlue: true
  }
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });
const theme = createTheme({
	palette: {
		darkBlue: createColor("#330eda"),
		appbarBlue: createColor("#8cb3ff")
	},
});

const App: FunctionComponent = () => {
	const { clientHeight, clientWidth } = useContext<WindowContextProps>(WindowContext);
	const widthToSet: string = getWidth(clientWidth, 96, 50, 800) + "%";
	const heightToSet: string = String(clientHeight - 176) + "px";

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
};

export default App;
