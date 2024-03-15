const loadText = document.querySelector('.loading-text')
const bg = document.querySelector('.bg')

let load = 0
// 设置定时器每30ms进行进度加1直到100%
let int = setInterval(blurring, 30)

function blurring(){
    load++

    if(load > 99){
        clearInterval(int)
    }
    // 界面上的数字一直跟着改变直到100，使用到了模板字符串
    loadText.innerText = `${load}%`
    // 这里是一个加载的进度数字慢慢透明度增大淡出的效果
    // 主要是利用的映射，进度是0到100，映射到透明底由0变为1，就是逐渐清晰
    loadText.style.opacity = scale(load, 0, 100, 1, 0) 
    // 模糊度是30，逐渐减为0，同上，模糊度由30到0，对应的映射也是0到100，对应的刚好是百分比%
    bg.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`
}


// 堆栈溢出
// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  }