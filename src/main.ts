
// interface Episode {
//   title: string
//   link: string
//   pubDate: string
//   guid: string
//   tracks: Array<string>,
//   links: Array<string>
// }

function hasMediaSession(): boolean {
  return "mediaSession" in navigator
}

const mfpAudioPlayer = document.querySelector<HTMLAudioElement>('#mfp-audio-player')!
const buttonPlay = document.querySelector<HTMLButtonElement>('#button-play')!
const buttonStop = document.querySelector<HTMLButtonElement>('#button-stop')!
const buttonSeekBack = document.querySelector<HTMLButtonElement>('#button-seek-back')!
const buttonSeekForward = document.querySelector<HTMLButtonElement>('#button-seek-forward')!

const title = document.querySelector<HTMLParagraphElement>('#mini-player-title')!
const duration = document.querySelector<HTMLParagraphElement>('#mini-player-duration')!

let curLink: HTMLAnchorElement | null = null


function showMiniPlayButton() {
  buttonPlay.classList.remove('hidden')
  buttonStop.classList.add('hidden')
}

function showMiniStopButton() {
  buttonPlay.classList.add('hidden')
  buttonStop.classList.remove('hidden')
}

mfpAudioPlayer.addEventListener('play', () => {
  console.log('Audio player is playing')
  navigator.mediaSession.playbackState = 'playing'
})

mfpAudioPlayer.addEventListener('pause', () => {
  console.log('Audio player is paused')
  navigator.mediaSession.playbackState = 'paused'
  showMiniPlayButton()
  _toggleSeekButtons()
})

mfpAudioPlayer.addEventListener('ended', () => {
  console.log('Audio player is ended')
  showMiniPlayButton()
})

mfpAudioPlayer.addEventListener('loadstart', () => {
  console.log('Audio player is loading')
})

mfpAudioPlayer.addEventListener('canplay', async () => {
  console.log('Audio player can play')
  await mfpAudioPlayer.play()
})

function _secondsToTime(seconds: number): string {

  if (isNaN(seconds) || seconds < 0) {
    return '00:00:00'
  }

  const wholeSeconds = Math.floor(seconds)
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const secs = (wholeSeconds % 3600) % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

mfpAudioPlayer.addEventListener('timeupdate', () => {
  duration.textContent = _secondsToTime(mfpAudioPlayer.currentTime)
  //console.log('Audio player time update:', mfpAudioPlayer.currentTime, duration.textContent)
})

buttonStop.addEventListener('click', () => {
  if (buttonStop.classList.contains('player-controls-disabled')) {
    console.log('Play button is disabled, ignoring click')
    return
  }
  console.log('Stop button clicked')
  mfpAudioPlayer.pause()
  showMiniPlayButton()
})

buttonPlay.addEventListener('click', () => {
  if (buttonPlay.classList.contains('player-controls-disabled')) {
    return
  }
  mfpAudioPlayer.play()
  showMiniStopButton()
})

buttonSeekBack.addEventListener('click', () => {
  if (buttonSeekBack.classList.contains('player-controls-disabled')) {
    return
  }
  mfpAudioPlayer.currentTime = Math.max(0, mfpAudioPlayer.currentTime - 30)
})

buttonSeekForward.addEventListener('click', () => {
  if (buttonSeekForward.classList.contains('player-controls-disabled')) {
    return
  }
  mfpAudioPlayer.currentTime = Math.min(mfpAudioPlayer.duration - 1, mfpAudioPlayer.currentTime + 30)
})


const PLAYER_CONTROLS_DISABLED_CLASS = 'player-controls-disabled'


function _toggleSeekButtons() {
  console.log('Toggling seek buttons')
  if (buttonSeekBack.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    console.log('Enabling seek buttons')
    buttonSeekBack.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
    buttonSeekForward.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  } else {
    console.log('Disabling seek buttons')
    buttonSeekBack.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
    buttonSeekForward.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  }
}


function _enableMiniPlayerControls() {
  buttonSeekBack.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonSeekForward.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonPlay.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonStop.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonPlay.classList.add('hidden')
  buttonStop.classList.remove('hidden')
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLAnchorElement
  if (target.tagName === 'A' && target.href) {
    console.log('Link clicked:', target.href)

    curLink = target

    console.log('curlink: ', curLink)

    console.log(target.dataset)
    try {
      const links = JSON.parse(target.dataset.links as string)
      console.log('Links:', links)
      const tracks = JSON.parse(target.dataset.tracks as string)
      console.log('Tracks:', tracks)
    } catch (e) {
      console.error('Error parsing links and tracks:', e)
    }

    const titleText = `${target.innerText}`

    title.textContent = titleText
    duration.textContent = '00:00:00'

    mfpAudioPlayer.src = target.href
    mfpAudioPlayer.load()

    _enableMiniPlayerControls()

    if (hasMediaSession()) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: titleText,
        artist: "musicforprogramming.net",
        album: titleText,
        artwork: [
          { src: "mfp.png" },
        ]
      })
    }

    event.preventDefault()
  }
})

document.addEventListener("visibilitychange", () => {
  console.log(`visibility change: ${document.visibilityState}`)
})

if (hasMediaSession()) {
  navigator.mediaSession.setActionHandler('play', async () => {
    await mfpAudioPlayer.play()
    showMiniStopButton()
  })

  navigator.mediaSession.setActionHandler('pause', async () => {
    mfpAudioPlayer.pause()
    showMiniPlayButton()
  })
}
