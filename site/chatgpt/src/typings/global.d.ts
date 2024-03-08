/**
 * Window 全局对象接口，用于描述在浏览器环境中全局可访问的变量
 */
interface Window {
	$loadingBar?: import("naive-ui").LoadingBarProviderInst; // 加载条提供者实例（可选）
	$dialog?: import("naive-ui").DialogProviderInst; // 对话框提供者实例（可选）
	$message?: import("naive-ui").MessageProviderInst; // 消息提供者实例（可选）
	$notification?: import("naive-ui").NotificationProviderInst; // 通知提供者实例（可选）
}
