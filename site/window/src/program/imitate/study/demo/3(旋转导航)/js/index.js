const open = document.getElementById('open')
const close = document.getElementById('close')
const container = document.querySelector('.container')
// 增加或者删除show-nav的class类
open.addEventListener('click', () => {
    container.classList.add('show-nav')
})

close.addEventListener('click', () => {
    container.classList.remove('show-nav')
})