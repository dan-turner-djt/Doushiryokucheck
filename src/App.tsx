import { FunctionComponent, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WindowContext, WindowContextProps } from "./Contexts/WindowContext";
import { Links as links } from "./utils";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Header from "./Components/Header/Header";
import { PaletteColor, ThemeProvider, createTheme } from "@mui/material";
import { getWidth } from "./Utils/Screen";
import Footer from "./Components/Footer.tsx/Footer";

const darkBlue = "#1122cc";
const lightBlue = "#8cb3ff";

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
		darkBlue: createColor(darkBlue),
		appbarBlue: createColor(lightBlue)
	},
	components: {
		MuiSwitch: {
			styleOverrides: {
				switchBase: {
					"&.Mui-checked": {
						opacity: 1,
						color: darkBlue
					},
					"Mui-checked+.MuiSwitch-track": {
						opacity: 1,
						backgroundColor: lightBlue
					}
				},
				colorPrimary: {
					color: lightBlue,
				},
				track: {
					opacity: 0.2,
					backgroundColor: lightBlue,
					".Mui-checked.Mui-checked + &": {
						opacity: 1,
						backgroundColor: lightBlue
					}
				}
			}
		},
		MuiCheckbox: {
			styleOverrides: {
				colorPrimary: {
					"&.Mui-checked": {
						color: darkBlue
					},
					"&.MuiCheckbox-indeterminate": {
						color: darkBlue
					}
				}
			}
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: "black",
					"&.Mui-focused": {
						color: "black"
					}
				}
			}
		}
	}
});

const App: FunctionComponent = () => {
	const { clientHeight, clientWidth } = useContext<WindowContextProps>(WindowContext);
	const widthToSet: string = getWidth(clientWidth, 96, 50, 800) + "%";
	const heightToSet: string = String(clientHeight - 224) + "px";

	return (
		<ThemeProvider theme={ theme }>
			<BrowserRouter>
				<div className="App">
					<Header/>
					<div className="main-content" style={{width: widthToSet, minHeight: heightToSet}}>
						<Routes>
							<Route path={ links.Home } element={ <Home/> }/>
							<Route path='*' element={ <NotFound/> }/>
						</Routes>
					</div>
					<Footer/>
				</div>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
