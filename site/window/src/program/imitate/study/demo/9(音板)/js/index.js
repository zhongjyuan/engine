const sounds = ['applause', 'boo', 'gasp', 'tada', 'victory', 'wrong']

sounds.forEach(sound => {
    // 给每个加上按钮
    const btn = document.createElement('button')
    // 加上btn类名
    btn.classList.add('btn')
    // 按钮上的文字描述为它本身的sound名
    btn.innerText = sound
    // 点击哪个哪个开始播放
    btn.addEventListener('click', () => {
        // 设置点击另一个上一个停止播放
        stopSongs()
        document.getElementById(sound).play()
    })

    document.getElementById('buttons').
        // 给新建的btn上树
        appendChild(btn)
})

function stopSongs() {
    sounds.forEach(sound => {
        const song = document.getElementById(sound)
        // 暂停
        song.pause()
        //当前音频的进度归零
        song.currentTime = 0
    })
}