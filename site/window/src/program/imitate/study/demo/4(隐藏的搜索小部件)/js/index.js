const search = document.querySelector('.search')
const btn = document.querySelector('.btn')
const input = document.querySelector('#input')

btn.addEventListener('click', () => {
    // toggle() 方法用于绑定两个或多个事件处理器函数，以响应被选元素的轮流的 click 事件。
    search.classList.toggle('active')
    // 获取焦点
    input.focus()
})