const counters = document.querySelectorAll('.counter')

counters.forEach(counter => {
    counter.innerText = '0 '

    const updateCounter = () => {
        // getAttribute获取节点的属性
        // data-target ：事件的作用对象
        const target = Number(counter.getAttribute('data-target'))
        // target就是设置的最终值
        // console.log(typeof target, target) number 12000
        const c = Number(counter.innerText)
        // 每次增加多少，取决于快慢
        const increment = target / 200

        // console.log(increment)
        if (c < target) {
            // 向上取整
            counter.innerText = `${Math.ceil(c + increment)}`
            // 1ms重新调用，不然它会在第一次运行完就结束
            setTimeout(updateCounter, 1)
        } else {
            counter.innerText = target
        }
    }

    updateCounter()
})