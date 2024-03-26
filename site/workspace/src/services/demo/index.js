import { get } from "@/utils/request";

export function fetchDemoAPI() {
	return get({
		url: "/pet/1",
	});
}
