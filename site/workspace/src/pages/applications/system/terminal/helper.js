export const fetchIPDetails = async () => {
	try {
		const response = await fetch("https://ipapi.co/json");
		const data = await response.json();
		return [data];
	} catch (error) {
		return [
			{
				ip: "__network_error",
				network: "__kindly check internet connection",
				city: "",
				region: "",
				org: "",
				postal: "",
			},
		];
	}
};

export const getColorCode = (color) => {
	let code = "#000000";
	const colorMap = {
		0: "#000000",
		1: "#0000AA",
		2: "#00AA00",
		3: "#00AAAA",
		4: "#AA0000",
		5: "#AA00AA",
		6: "#AA5500",
		7: "#AAAAAA",
		8: "#555555",
		9: "#5555FF",
		A: "#55FF55",
		B: "#55FFFF",
		C: "#FF5555",
		D: "#FF55FF",
		E: "#FFFF55",
		F: "#FFFFFF",
	};

	const colorKey = color.toUpperCase();
	if (colorMap[colorKey]) {
		code = colorMap[colorKey];
	}

	return code;
};
