package common

import "fmt"

const (
	ByAll    = "all"
	ByEmail  = "email"
	ByPusher = "pusher"
)

func Notify(by string, title string, description string, content string) error {
	if by == ByEmail {
		return SendEmail(title, RootUserEmail, content)
	}

	if by == ByPusher {
		return SendMessage(title, description, content)
	}

	return fmt.Errorf("unknown notify method: %s", by)
}
