const body = document.body
const slides = document.querySelectorAll('.slide')
const leftBtn = document.getElementById('left')
const rightBtn = document.getElementById('right')

// 一开始默认下标为0，即显示第一张
let activeSlide = 0

// 左边的滑块，下标++，即下一张图片
rightBtn.addEventListener('click', () => {
  activeSlide++

  //   最后一张再往后就直接到第一张
  if (activeSlide > slides.length - 1) {
    activeSlide = 0
  }

  setBgToBody()
  setActiveSlide()
})

// 右边的滑块，下标--，即上一张图片
leftBtn.addEventListener('click', () => {
  activeSlide--

  //   到第一张之后再上一张就到最后一张
  if (activeSlide < 0) {
    activeSlide = slides.length - 1
  }

  setBgToBody()
  setActiveSlide()
})

setBgToBody()

// 改变背景图片
function setBgToBody() {
  body.style.backgroundImage = slides[activeSlide].style.backgroundImage
}

// 到哪个图片的下标后就给它加上active，就能让图片opacity为1显示
/* 当前opacity为1显示之后其他的就为0了 */
function setActiveSlide() {
  slides.forEach((slide) => slide.classList.remove('active'))

  slides[activeSlide].classList.add('active')
}