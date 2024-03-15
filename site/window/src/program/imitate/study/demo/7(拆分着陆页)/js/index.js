const left = document.querySelector('.left')
const right = document.querySelector('.right')
const container = document.querySelector('.container')

// 监听一个鼠标输入事件
// 这是进入左边就左边75%，不是左边就恢复原样
left.addEventListener('mouseenter', () => container.classList.add('hover-left'))
left.addEventListener('mouseleave', () => container.classList.remove('hover-left'))

// 这是进入右边就右边75%，不是右边就恢复原样
right.addEventListener('mouseenter', () => container.classList.add('hover-right'))
right.addEventListener('mouseleave', () => container.classList.remove('hover-right'))