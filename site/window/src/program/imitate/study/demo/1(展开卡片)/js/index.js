// 选中所有的panel
const panels = document.querySelectorAll('.panel')
// querySelectorAll选中的形式是一串数组，所以我们后面使用foeEach
panels.forEach((panel) => {
    // 点击事件
    panel.addEventListener('click', () => {
        // 清除其他的class上的active,这里一定要放在增加之前，不然会导致所有的都展开
        removeActiveClasses()
        // 给被点击的class增加active，这样它就有了active属性，也就会被展开，根据css里面的flex改成了5
        panel.classList.add('active')

    })
})

// 该方法用于去除active
function removeActiveClasses() {
    panels.forEach((panel) => {
        panel.classList.remove('active')
    })
}