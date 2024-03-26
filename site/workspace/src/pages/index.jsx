import { useSelector, useDispatch } from "react-redux";

import { fetchDemoAPI } from "@/services/demo";
import { actions } from "@/stores/modules/demo";

export default function Index() {
	const count = useSelector((state) => state.counter.value);
	const dispatch = useDispatch();

	async function fetchConfig() {
		const { data } = await fetchDemoAPI();
		console.log(data);
	}

	return (
		<div>
			<div>
				<button
					aria-label="Increment value"
					onClick={() => {
						dispatch(actions.increment());
						fetchConfig();
					}}
				>
					Increment
				</button>
				<span>{count}</span>
				<button aria-label="Decrement value" onClick={() => dispatch(actions.decrement())}>
					Decrement
				</button>
			</div>
		</div>
	);
}
