import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./stores/index";

import App from "./App";
import Loading from "./components/loading";

ReactDOM.createRoot(document.getElementById("zhongjyuan")).render(
	<React.StrictMode>
		<Suspense fallback={<Loading />}>
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</Suspense>
	</React.StrictMode>
);
