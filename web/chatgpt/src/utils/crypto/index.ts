import CryptoJS from "crypto-js";

const CryptoSecret = "__CRYPTO_SECRET__"; // 加密解密所需的密钥

/**
 * 对数据进行加密处理
 * @param data 要加密的数据
 * @returns 加密后的字符串
 */
export function enCrypto(data: any) {
	const str = JSON.stringify(data); // 将数据转换为 JSON 字符串
	return CryptoJS.AES.encrypt(str, CryptoSecret).toString(); // 使用 AES 加密数据并返回加密后的字符串
}

/**
 * 对字符串进行解密处理
 * @param data 待解密的字符串
 * @returns 解密后的数据，如果解密失败则返回 null
 */
export function deCrypto(data: string) {
	const bytes = CryptoJS.AES.decrypt(data, CryptoSecret); // 使用 AES 解密字符串
	const str = bytes.toString(CryptoJS.enc.Utf8); // 将解密后的字节转换为 UTF-8 字符串

	if (str) return JSON.parse(str); // 如果解密成功，则将字符串转换回对象并返回

	return null; // 解密失败时返回 null
}
