package config

import (
	"encoding/json"
	stdlog "log"
	"os"
	"sync"
	"zhongjyuan/log"
)

// Configuration 项目配置
type Configuration struct {
	Logger     log.Logger // 日志记录器
	ProjectDir string     // 项目目录

	AppID        int64  `json:"appid"`         //
	Token        string `json:"token"`         //
	NowApiAppKey int64  `json:"nowapi_appkey"` //
	NowApiSign   string `json:"nowapi_sign"`   //

	LogLevel int64 `json:"log_level"` // 日志级别

	GuildCreateEvent string `json:"guild_create_event"` // 机器人被加入到某个频道的事件

	HelloCMD string `json:"hello_cmd"` // 打招呼
	TimeCMD  string `json:"time_cmd"`  // 时间

	PinMessageCMD      string `json:"pin_message_cmd"`      // 设置精华消息
	EmojiMessageCMD    string `json:"emoji_message_cmd"`    // 消息表情表态
	DirectMessageCMD   string `json:"direct_message_cmd"`   // 私信消息回复
	AnnounceMessageCMD string `json:"announce_message_cmd"` // 设置公告消息

	DirectWeatherMessageCMD string `json:"direct_weather_message_cmd"` // 私信天气
	TodayWeatherMessageCMD  string `json:"today_weather_message_cmd"`  // 当前天气
	FutureWeatherMessageCMD string `json:"future_weather_message_cmd"` // 未来天气
	DressingIndexMessageCMD string `json:"dressing_index_message_cmd"` // 穿衣指数
	AirQualityMessageCMD    string `json:"air_quality_message_cmd"`    // 空气质量
}

// 使用 sync.Once 来确保函数只被执行一次
var once sync.Once

// 配置对象
var config *Configuration

// GetConfig 用于获取配置信息。
//
// 输入参数：
//   - 无。
//
// 输出参数：
//   - *Configuration: 返回配置信息对象指针。如果出现错误，则返回 nil。
func GetConfig() *Configuration {
	once.Do(func() {
		// 从文件中读取配置信息
		config = &Configuration{}

		// 打开配置文件
		file, err := os.Open("config.json")
		if err != nil {
			stdlog.Fatalf("open config err: %v", err)
			return
		}

		defer file.Close()

		// 解码 JSON 文件
		encoder := json.NewDecoder(file)
		err = encoder.Decode(config)
		if err != nil {
			stdlog.Fatalf("decode config err: %v", err)
			return
		}

		// 获取存储目录
		if currentDir, err := os.Getwd(); err == nil {
			setDefaultIfEmpty(&config.ProjectDir, currentDir)
		}

		// 设置默认值
		setDefaultIfEmpty(&config.HelloCMD, "hi")
		setDefaultIfEmpty(&config.TimeCMD, "时间")
		setDefaultIfEmpty(&config.PinMessageCMD, "精华")
		setDefaultIfEmpty(&config.EmojiMessageCMD, "表态")
		setDefaultIfEmpty(&config.DirectMessageCMD, "私信")
		setDefaultIfEmpty(&config.AnnounceMessageCMD, "公告")
		setDefaultIfEmpty(&config.GuildCreateEvent, "GUILD_CREATE")
		setDefaultIfEmpty(&config.DirectWeatherMessageCMD, "/私信天气")
		setDefaultIfEmpty(&config.TodayWeatherMessageCMD, "/当前天气")
		setDefaultIfEmpty(&config.FutureWeatherMessageCMD, "/未来天气")
		setDefaultIfEmpty(&config.DressingIndexMessageCMD, "/穿衣指数")
		setDefaultIfEmpty(&config.AirQualityMessageCMD, "/空气质量")

		// 初始化日志记录对象
		config.Logger = log.NewFileLogger("logs", log.LogLevel(config.LogLevel))
	})

	return config
}

func AppID() int64 {
	return config.AppID
}

func Token() string {
	return config.Token
}

func NowApiAppKey() int64 {
	return config.NowApiAppKey
}

func NowApiSign() string {
	return config.NowApiSign
}
