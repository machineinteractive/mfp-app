import './style.css'

// interface Episode {
//   title: string
//   link: string
//   pubDate: string
//   guid: string
//   tracks: Array<string>,
//   links: Array<string>
// }

const PLAYER_CONTROLS_DISABLED_CLASS = 'player-controls-disabled'
const HIDDEN_CLASS = 'hidden'
const SEEK_30_SECONDS = 30

const header = document.querySelector<HTMLElement>('header')!
const chevronDown = document.querySelector<HTMLElement>('#chevron-down')!
const eye = document.querySelector<HTMLElement>('#eye')!
const playlist = document.querySelector<HTMLElement>('#playlist')!
const about = document.querySelector<HTMLElement>('#about')!
const mfpAudioPlayer = document.querySelector<HTMLAudioElement>('#mfp-audio-player')!
const buttonPlay = document.querySelector<HTMLButtonElement>('#button-play')!
const buttonStop = document.querySelector<HTMLButtonElement>('#button-stop')!
const buttonSeekBack = document.querySelector<HTMLButtonElement>('#button-seek-back')!
const buttonSeekForward = document.querySelector<HTMLButtonElement>('#button-seek-forward')!

const miniPlayerTitle = document.querySelector<HTMLParagraphElement>('#mini-player-title')!
const miniPlayerDuration = document.querySelector<HTMLParagraphElement>('#mini-player-duration')!

const currentlyPlayingTitle = document.querySelector<HTMLHeadingElement>('#currently-playing-title')!
const currentlyPlayingTracks = document.querySelector<HTMLParagraphElement>('#currently-playing-tracks')!
const currentlyPlayingLinks = document.querySelector<HTMLParagraphElement>('#currently-playing-links')!



let curLink: HTMLAnchorElement | null = null

function hasMediaSession(): boolean {
  return "mediaSession" in navigator
}

function showMiniPlayButton() {
  buttonPlay.classList.remove(HIDDEN_CLASS)
  buttonStop.classList.add(HIDDEN_CLASS)
}

function showMiniStopButton() {
  buttonPlay.classList.add(HIDDEN_CLASS)
  buttonStop.classList.remove(HIDDEN_CLASS)
}

mfpAudioPlayer.addEventListener('play', () => {
  console.log('Audio player is playing')
  navigator.mediaSession.playbackState = 'playing'
  _enableSeekButtons()
})

mfpAudioPlayer.addEventListener('pause', () => {
  console.log('Audio player is paused')
  navigator.mediaSession.playbackState = 'paused'
  showMiniPlayButton()
  _disableSeekButtons()
})

mfpAudioPlayer.addEventListener('ended', () => {
  console.log('Audio player is ended')
  showMiniPlayButton()
  _disableSeekButtons()
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
  miniPlayerDuration.textContent = _secondsToTime(mfpAudioPlayer.currentTime)
  //console.log('Audio player time update:', mfpAudioPlayer.currentTime, duration.textContent)
})

buttonStop.addEventListener('click', () => {
  if (buttonStop.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    console.log('Play button is disabled, ignoring click')
    return
  }
  console.log('Stop button clicked')
  mfpAudioPlayer.pause()
  showMiniPlayButton()
})

buttonPlay.addEventListener('click', () => {
  if (buttonPlay.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }
  mfpAudioPlayer.play()
  showMiniStopButton()
})

buttonSeekBack.addEventListener('click', () => {
  if (buttonSeekBack.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }

  const currentTime = Math.floor(mfpAudioPlayer.currentTime - SEEK_30_SECONDS)

  mfpAudioPlayer.currentTime = Math.max(0, currentTime)
})

buttonSeekForward.addEventListener('click', () => {
  if (buttonSeekForward.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }

  const duration = Math.floor(mfpAudioPlayer.duration - 1)
  const currentTime = Math.floor(mfpAudioPlayer.currentTime + SEEK_30_SECONDS)

  mfpAudioPlayer.currentTime = Math.min(duration, currentTime)
})

function _enableSeekButtons() {
  console.log('Enabling seek buttons')
  buttonSeekBack.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonSeekForward.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
}

function _disableSeekButtons() {
  console.log('Disabling seek buttons')
  buttonSeekBack.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonSeekForward.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
}

function _enableMiniPlayerControls() {
  buttonSeekBack.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonSeekForward.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonPlay.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonStop.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  buttonPlay.classList.add(HIDDEN_CLASS)
  buttonStop.classList.remove(HIDDEN_CLASS)
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLAnchorElement

  if (target.tagName === 'A' && target.href && target.dataset.tracks) {
    console.log('Link clicked:', target.href)

    curLink = target

    console.log('curlink: ', curLink)

    console.log(target.dataset)

    const titleText = `${target.innerText}`

    try {
      const links = JSON.parse(target.dataset.links as string)
      console.log('Links:', links)
      const tracks = JSON.parse(target.dataset.tracks as string)
      console.log('Tracks:', tracks)

      currentlyPlayingTitle.innerHTML = titleText
      currentlyPlayingTracks.innerHTML = tracks.map((track: string) => {

        const url = `https://www.google.com/search?q=${encodeURIComponent('site:discogs.com ')}${encodeURIComponent(track)}`

        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${track}</a>`
      }).join('<br>')

      currentlyPlayingLinks.innerHTML = links.map((link: string) => {
        return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`
      }).join('<br>')

    } catch (e) {
      console.error('Error parsing links and tracks:', e)
    }



    miniPlayerTitle.textContent = titleText
    miniPlayerDuration.textContent = '00:00:00'

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

function _toggleAbout() {
  if (!about.style?.display || about.style.display === 'none') {
    about.style.display = 'flex'
    playlist.style.display = 'none'
    chevronDown.style.opacity = '1'
    eye.style.opacity = '0'
  } else {
    about.style.display = 'none'
    playlist.style.display = 'flex'
    chevronDown.style.opacity = '0'
    eye.style.opacity = '1'
  }
}

header.addEventListener('click', () => {
  console.log('Header clicked: ', about.style.display || 'none')
  _toggleAbout()
})

miniPlayerTitle.addEventListener('click', () => {
  console.log('Mini player title clicked: ', about.style.display || 'none')
  _toggleAbout()
})