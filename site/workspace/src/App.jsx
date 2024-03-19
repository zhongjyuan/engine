import { useRoutes } from "react-router-dom";
import routes from "./routers/index.jsx";

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
