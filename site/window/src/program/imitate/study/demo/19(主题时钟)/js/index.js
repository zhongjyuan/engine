const hourEl = document.querySelector('.hour')
const minuteEl = document.querySelector('.minute')
const secondEl = document.querySelector('.second')
const timeEl = document.querySelector('.time')
const dateEl = document.querySelector('.date')
const toggle = document.querySelector('.toggle')

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 切换白天黑夜模式
toggle.addEventListener('click', (e) => {
    const html = document.querySelector('html')
    // 只要html包含dark，那么就是夜间模式，否则是白天模式，
    // 夜间模式点击之后要remove掉dark类变成白天模式，白天模式被点击添加dark类变成黑夜模式
    if (html.classList.contains('dark')) {
        html.classList.remove('dark')
        e.target.innerHTML = 'Dark mode'
    } else {
        html.classList.add('dark')
        e.target.innerHTML = 'Light mode'
    }
})

function setTime() {
    const time = new Date();
    // 月
    const month = time.getMonth()
    // 星期几
    const day = time.getDay()
    // 日
    const date = time.getDate()
    // 时
    const hours = time.getHours()
    // 12小时制
    const hoursForClock = hours >= 13 ? hours % 12 : hours;
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    // 如果值大于12就显示PM下午，否则就AM显示上午
    const ampm = hours >= 12 ? 'PM' : 'AM'

    // 时针值从0-12转一周
    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hoursForClock, 0, 12, 0, 360)}deg)`
    // 分针值从0-60转一周
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minutes, 0, 60, 0, 360)}deg)`
    // 秒针值从0-60转一周
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(seconds, 0, 60, 0, 360)}deg)`

    // 分钟小于10的时候前面有个0，否则直接显示分钟
    timeEl.innerHTML = `${hoursForClock}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`
    dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
}

// 比例函数，映射一个范围，然后值随这个范围变化
// StackOverflow https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

setTime()

// 每一秒调用一次，达到秒针一秒一次
setInterval(setTime, 1000)