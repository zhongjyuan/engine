import { useRoutes } from "react-router-dom";

import routes from "./routers/index";

import "./common/i18nconf";

import "./assets/css/global.css";
import "./assets/css/index.css";
import "./assets/css/reset.css";

function App() {
	const element = useRoutes(routes);
	return <>{element}</>;
}

export default App;

/**
 * import { Routes } from "react-router-dom";
 * import routes from "@/router/index";
 *
 * function App() {
 * 	return <Routes>{routes}</Routes>;
 * }
 *
 * export default App;
 */
