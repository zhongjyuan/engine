const error = "_ERROR";
const success = "_SUCCESS";
const request = "_REQUEST";
const response = "_RESPONSE";

const unique = "_UNIQUE";
const connection = "_CONNECTION";
const disconnection = "_DISCONNECTION";

/**订阅配置 */
module.exports = {
	server: {
		connection: "server" + connection,
		disconnect: "server" + disconnection,
	},
	tenant: {
		error: "tenant" + error,
		connection: "tenant" + connection,
		disconnect: "tenant" + disconnection,
	},
	socketserver: {
		connection: "socketserver" + connection,
		disconnect: "socketserver" + disconnection,
	},
	socketclient: {
		connection: "socketclient" + connection,
		disconnect: "socketclient" + disconnection,
	},
	mutilatelanguage: {
		error: "mutilatelanguage" + error,
		request: "mutilatelanguage" + request,
		response: "mutilatelanguage" + response,
		success: "mutilatelanguage" + success,
	},
	signup: {
		error: "signup" + error,
		request: "signup" + request,
		response: "signup" + response,
		success: "signup" + success,
	},
	login: {
		error: "login" + error,
		request: "login" + request,
		response: "login" + response,
		success: "login" + success,
		unique: "login" + unique,
	},
	loginout: {
		error: "loginout" + error,
		request: "loginout" + request,
		response: "loginout" + response,
		success: "loginout" + success,
	},
	account: {
		error: "account" + error,
		request: "account" + request,
		response: "account" + response,
		needupdatepassword: "account_needupdatepassword",
		updatepassword_request: "updatepassword" + request,
		updatepassword_response: "updatepassword" + response,
	},
};
