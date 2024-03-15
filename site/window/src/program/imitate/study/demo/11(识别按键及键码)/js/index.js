const insert = document.getElementById('insert')

window.addEventListener('keydown', (event) => {
    // 如果等于空那么就是释放空间
    insert.innerHTML = `
    <div class="key">
        ${event.key === ' ' ? 'space' : event.key}
        <small>event.key</small>
    </div>

    <div class="key">
        ${event.keyCode}
        <small>event.keyCode</small>
    </div>

    <div class="key">
        ${event.code}
        <small>event.code</small>
    </div>
    `
})