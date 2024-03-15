package common

import (
	"crypto/rand"
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"net/smtp"
	"strings"
	"time"
)

// SendEmail 用于发送邮件。
//
// 输入参数：
//   - subject string: 邮件主题。
//   - receiver string: 收件人的邮箱地址，多个邮箱地址以分号分隔。
//   - content string: 邮件内容。
//
// 输出参数：
//   - error: 如果发送邮件过程中出现错误，则返回错误信息；否则为 nil。
func SendEmail(subject string, receiver string, content string) error {
	// 编码邮件主题
	encodedSubject := fmt.Sprintf("=?UTF-8?B?%s?=", base64.StdEncoding.EncodeToString([]byte(subject)))

	parts := strings.Split(SMTPAccount, "@")
	var domain string
	if len(parts) > 1 {
		domain = parts[1]
	}

	var err error

	// Generate a unique Message-ID
	buf := make([]byte, 16)
	_, err = rand.Read(buf)
	if err != nil {
		return err
	}
	messageId := fmt.Sprintf("<%x@%s>", buf, domain)

	// 构建邮件内容
	mail := []byte(fmt.Sprintf("To: %s\r\n"+
		"From: %s<%s>\r\n"+
		"Subject: %s\r\n"+
		"Message-ID: %s\r\n"+ // add Message-ID header to avoid being treated as spam, RFC 5322
		"Date: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n\r\n%s\r\n",
		receiver,
		SystemName,
		SMTPAccount,
		encodedSubject,
		messageId,
		time.Now().Format(time.RFC1123Z),
		content),
	)

	// SMTP认证信息
	auth := smtp.PlainAuth("", SMTPAccount, SMTPToken, SMTPServer)

	// SMTP地址
	addr := fmt.Sprintf("%s:%d", SMTPServer, SMTPPort)

	// 收件人列表
	to := strings.Split(receiver, ";")

	// 根据端口选择不同的发送方式
	if SMTPPort == 465 {
		// 创建TLS配置
		tlsConfig := &tls.Config{
			InsecureSkipVerify: true,
			ServerName:         SMTPServer,
		}

		// 连接到SMTP服务器
		conn, err := tls.Dial("tcp", fmt.Sprintf("%s:%d", SMTPServer, SMTPPort), tlsConfig)
		if err != nil {
			return err
		}

		// 创建SMTP客户端
		client, err := smtp.NewClient(conn, SMTPServer)
		if err != nil {
			return err
		}
		defer client.Close()

		// SMTP认证
		if err = client.Auth(auth); err != nil {
			return err
		}

		// 发送邮件发送者信息
		if err = client.Mail(SMTPAccount); err != nil {
			return err
		}

		// 发送邮件接收者信息
		receiverEmails := strings.Split(receiver, ";")
		for _, receiver := range receiverEmails {
			if err = client.Rcpt(receiver); err != nil {
				return err
			}
		}

		// 开始写入邮件内容
		w, err := client.Data()
		if err != nil {
			return err
		}

		_, err = w.Write(mail)
		if err != nil {
			return err
		}

		err = w.Close()
		if err != nil {
			return err
		}
	} else {
		// 使用普通方式发送邮件
		err = smtp.SendMail(addr, auth, SMTPAccount, to, mail)
	}
	return err
}
