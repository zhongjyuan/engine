import { useEffect, useCallback, createContext } from "react";
import { useDispatch } from "react-redux";

import { SET_SITE_INFO } from "store/actions";

import { API } from "utils/api";
import { showNotice, showError } from "utils/common";

export const LoadStatusContext = createContext();

// eslint-disable-next-line
const StatusProvider = ({ children }) => {
	const dispatch = useDispatch();

	const loadStatus = useCallback(async () => {
		const res = await API.get("/api/status");
		const { success, data } = res.data;
		let systemName = "";
		if (success) {
			if (!data.chatLink) {
				delete data.chatLink;
			}
			localStorage.setItem("siteInfo", JSON.stringify(data));
			localStorage.setItem("quotaPerUnit", data.quotaPerUnit);
			localStorage.setItem("displayInCurrencyEnabled", data.displayInCurrencyEnabled);
			dispatch({ type: SET_SITE_INFO, payload: data });
			if (
				data.version !== process.env.REACT_APP_VERSION &&
				data.version !== "v0.0.0" &&
				data.version !== "" &&
				process.env.REACT_APP_VERSION !== ""
			) {
				showNotice(`新版本可用：${data.version}，请使用快捷键 Shift + F5 刷新页面`);
			}
			if (data.systemName) {
				systemName = data.systemName;
			}
		} else {
			const backupSiteInfo = localStorage.getItem("siteInfo");
			if (backupSiteInfo) {
				const data = JSON.parse(backupSiteInfo);
				if (data.systemName) {
					systemName = data.systemName;
				}
				dispatch({
					type: SET_SITE_INFO,
					payload: data,
				});
			}
			showError("无法正常连接至服务器！");
		}

		if (systemName) {
			document.title = systemName;
		}
	}, [dispatch]);

	useEffect(() => {
		loadStatus().then();
	}, [loadStatus]);

	return <LoadStatusContext.Provider value={loadStatus}> {children} </LoadStatusContext.Provider>;
};

export default StatusProvider;
