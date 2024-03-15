const smallCups = document.querySelectorAll('.cup-small')
const listers = document.getElementById('liters')
const percentage = document.getElementById('percentage')
const remained = document.getElementById('remained')

// 改变大杯子方法
updateBigCup()

smallCups.forEach((cup, idx) => {
    // 每个被点击的杯子都被加上高亮方法
    cup.addEventListener('click', () => highlightCup(idx))
})

function highlightCup(idx) {

    // 如果点击当前已经高亮的杯子，而它的下一个是没有满的，那么需要减少这一杯的高亮
    // 如果没有这个判断，你点击当前高亮杯子的时候它是没有反应的。
    if (smallCups[idx].classList.contains('full') && !smallCups[idx].nextElementSibling.classList.contains('full')) {
        idx--
    }

    // 遍历当前被点击调用高亮方法的杯子前面的杯子，如果小于当前这个高亮杯子的序号，也要进行高亮
    // 比如说，我点击的是4号杯子，那么前三个也要被点亮（被加上full的类名）如果不是，就去除
    smallCups.forEach((cup, idx2) => {
        if (idx2 <= idx) {
            cup.classList.add('full')
        } else {
            cup.classList.remove('full')
        }
    })

    // 小杯子点击事件触发完之后调用大杯子的方法
    updateBigCup()
}

// 大杯子里面的相关方法
function updateBigCup() {
    const fullCups = document.querySelectorAll('.cup-small.full').length
    const totalCups = smallCups.length

    if (fullCups === 0) {
        percentage.style.visibility = 'hidden'
        percentage.style.height = 0
    } else {
        percentage.style.visibility = 'visible'
        percentage.style.height = `${fullCups / totalCups * 330}px`
        // 当前喝了的百分比
        percentage.innerText = `${fullCups / totalCups * 100}%`
    }

    if (fullCups === totalCups) {
        // 如果喝完了，就将remained隐藏掉
        remained.style.visibility = 'hidden'
        remained.style.height = 0
    } else {
        // 没喝完就显示还剩下多少L
        remained.style.visibility = 'visible'
        listers.innerText = `${2 - (250 * fullCups / 1000)}L`
    }
}

