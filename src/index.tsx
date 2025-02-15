import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { WindowContextProvider } from "./Contexts/WindowContext";
import { Provider } from "react-redux";
import store from "./Redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
	<StrictMode>
		<WindowContextProvider>
			<Provider store={ store }>
				<App />
			</Provider>
		</WindowContextProvider>
	</StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
