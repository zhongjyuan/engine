// 需要注册https://www.themoviedb.org/获取api
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=aeb581c1df0eec81df2bf78e58a740cf&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// 获取电影
getMovies(API_URL)

// 异步获取
async function getMovies(url) {
    const res = await fetch(url)
    // 获取json类型的数据
    const data = await res.json()

    showMovies(data.results)
}

// 显示电影
function showMovies(movies) {
    // 先清空main
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        // 自定义节点以及上树
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
        `
        main.appendChild(movieEl)
    })
}

// 获取电影分数方法
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value

    if (searchTerm && searchTerm !== '') {
        // 调用搜索api以及拿到你要搜索的关键字
        getMovies(SEARCH_API + searchTerm)
        // 将搜索框清空
        search.value = ''
    } else {
        // 重载页面
        window.location.reload()
    }
})