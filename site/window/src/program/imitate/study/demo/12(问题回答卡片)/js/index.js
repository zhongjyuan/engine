const toggle = document.querySelectorAll('.faq-toggle')

toggle.forEach(toggle => {
    toggle.addEventListener('click', () => {
        // parentNode是返回某节点的父节点，所以toggle.parentNode等价于包裹每个问题class名为faq的那个div
        // classList.toggle点击toggle标签时，会给这个标签添加和消除“active”类
        toggle.parentNode.classList.toggle('active')
    })
})