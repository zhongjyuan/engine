package service

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"zhongjyuan/qqbot/config"
	"zhongjyuan/qqbot/model"
)

// 获取网络请求的数据
func getNetworkData(url string) []byte {
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln("天气预报接口请求异常, err = ", err)
		return nil
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln("天气预报接口数据异常, err = ", err)
		return nil
	}
	return body
}

// 获取当前对应城市的天气数据
func GetNowWeatherByCity(cityName string) *model.WeatherResp {
	cfg := config.GetConfig()
	url := fmt.Sprintf("http://api.k780.com/?app=weather.today&cityNm=%s&appkey=%s&sign=%s&format=json", cityName, strconv.FormatInt(cfg.NowApiAppKey, 10), cfg.NowApiSign)
	body := getNetworkData(url)
	if body == nil {
		return nil
	}

	var weatherData model.WeatherResp
	err := json.Unmarshal(body, &weatherData)
	if err != nil {
		log.Fatalln("解析数据异常 err = ", err, body)
		return nil
	}

	if weatherData.Success != "1" {
		log.Fatalln("返回数据问题 err = ", weatherData.Msg)
		return nil
	}

	return &weatherData
}

// 获取城市未来几天的天气信息
func GetFutureWeatherByCity(cityName string) *model.FutureWeatherResp {
	cfg := config.GetConfig()
	url := fmt.Sprintf("http://api.k780.com/?app=weather.future&cityNm=%s&appkey=%s&sign=%s&format=json", cityName, strconv.FormatInt(cfg.NowApiAppKey, 10), cfg.NowApiSign)
	body := getNetworkData(url)
	if body == nil {
		return nil
	}
	var weather model.FutureWeatherResp
	err := json.Unmarshal(body, &weather)
	if err != nil {
		log.Fatalln("解析数据异常 err = ", err, body)
		return nil
	}
	if weather.Success != "1" {
		log.Fatalln("返回数据问题 err = ", weather.Msg)
		return nil
	}
	return &weather
}

// 获取城市的空气质量
func GetAQIByCity(cityName string) *model.AQIRsp {
	cfg := config.GetConfig()
	url := fmt.Sprintf("http://api.k780.com/?app=weather.pm25&cityNm=%s&appkey=%s&sign=%s&format=json", cityName, strconv.FormatInt(cfg.NowApiAppKey, 10), cfg.NowApiSign)
	body := getNetworkData(url)
	if body == nil {
		return nil
	}
	var weather model.AQIRsp
	err := json.Unmarshal(body, &weather)
	if err != nil {
		log.Fatalln("解析数据异常 err = ", err, body)
		return nil
	}
	if weather.Success != "1" {
		log.Fatalln("返回数据问题")
		return nil
	}
	return &weather
}

// 获取穿衣指数的信息
func GetClothIndexByCity(cityName string) *model.LifeIndexRsp {
	cfg := config.GetConfig()
	url := fmt.Sprintf("http://api.k780.com/?app=weather.lifeindex&cityNm=%s&appkey=%s&sign=%s&format=json", cityName, strconv.FormatInt(cfg.NowApiAppKey, 10), cfg.NowApiSign)
	body := getNetworkData(url)
	if body == nil {
		return nil
	}
	var weather model.LifeIndexRsp
	err := json.Unmarshal(body, &weather)
	if err != nil {
		log.Fatalln("解析数据异常 err = ", err, body)
		return nil
	}
	if weather.Success != "1" {
		log.Fatalln("返回数据问题")
		return nil
	}
	return &weather
}
