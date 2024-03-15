const boxes = document.querySelectorAll('.box')
// 滚动时触发事件
window.addEventListener('scroll', checkBoxes)

function checkBoxes() {
    // 文档显示区的高度为窗口的4/5，这里是设置底部触发器
    const triggerBottom = window.innerHeight / 5 * 4

    boxes.forEach(box => {
        // 设置盒子的顶部触发器，这个getBoundingClientRect()方法就是获取box盒子的顶部位置参数
        const boxTop = box.getBoundingClientRect().top
        // 当盒子的顶部触发器小于文档显示区底部触发器，那么盒子就会被添加上show，然后就实现了box的移入，如果不是，那么就是移除盒子
        // 举个例子，屏幕是1000px，然后文档显示区是800px，也就是底部触发器是800px，那么当一个盒子的顶部触发器为799px高度的时候，它就可以出现在文档显示区了
        if (boxTop < triggerBottom) {
            box.classList.add('show')
        } else {
            box.classList.remove('show')
        }
    })
}