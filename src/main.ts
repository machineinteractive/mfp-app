import './style.css'

// interface Episode {
//   title: string
//   link: string
//   pubDate: string
//   guid: string
//   tracks: Array<string>,
//   links: Array<string>
// }

const ZERO_ZERO_ZERO_TIME = '00:00:00'

const PLAYER_CONTROLS_DISABLED_CLASS = 'player-controls-disabled'
const HIDDEN_CLASS = 'hidden'
const SEEK_30_SECONDS = 30

const header = document.querySelector<HTMLElement>('header')!
const aboutCloseButton = document.querySelector<HTMLImageElement>('#about-close-button')!
const episodesContainer = document.querySelector<HTMLDivElement>('#episodes')!
const episodes = episodesContainer.querySelectorAll('A')
const about = document.querySelector<HTMLDialogElement>('#about')!
const mfpAudioPlayer = document.querySelector<HTMLAudioElement>('#mfp-audio-player')!
const miniPlayerPlayButton = document.querySelector<HTMLButtonElement>('#mp-button-play')!
const miniPlayerPauseButton = document.querySelector<HTMLButtonElement>('#mp-button-pause')!
const miniPlayerSeekBackButton = document.querySelector<HTMLButtonElement>('#mp-button-seek-back')!
const miniPlayerSeekForwardButton = document.querySelector<HTMLButtonElement>('#mp-button-seek-forward')!
const miniPlayerRandomEpisodeButton = document.querySelector<HTMLButtonElement>('#mp-button-random')!
const miniPlayerFullscreenButton = document.querySelector<HTMLButtonElement>('#mp-button-fullscreen')!

const miniPlayerTitle = document.querySelector<HTMLParagraphElement>('#mini-player-title')!
const miniPlayerDuration = document.querySelector<HTMLParagraphElement>('#mini-player-duration')!

const fullscreenPlayer = document.getElementById('fullscreen-player')!
const fullscreenCloseButton = document.querySelector<HTMLImageElement>('#fullscreen-close-button')!
const fullscreenPlayerTitle = document.querySelector<HTMLParagraphElement>('#fullscreen-player-title')!
const fullscreenPlayerTitleDuration = document.querySelector<HTMLParagraphElement>('#fullscreen-player-title-duration')!
const fullscreenPlayerDuration = document.querySelector<HTMLParagraphElement>('#fullscreen-player-duration')!
const fullscreenPlayerPlaylistButton = document.querySelector<HTMLButtonElement>('#fs-button-playlist')!

const fullscreenPlayerPlayButton = document.querySelector<HTMLButtonElement>('#fs-button-play')!
const fullscreenPlayerPauseButton = document.querySelector<HTMLButtonElement>('#fs-button-pause')!
const fullscreenPlayerSeekBackButton = document.querySelector<HTMLButtonElement>('#fs-button-seek-back')!
const fullscreenPlayerSeekForwardButton = document.querySelector<HTMLButtonElement>('#fs-button-seek-forward')!
const fullscreenPlayerSkipPrevButton = document.querySelector<HTMLButtonElement>('#fs-button-skip-prev')!
const fullscreenPlayerSkipNextButton = document.querySelector<HTMLButtonElement>('#fs-button-skip-next')!
const fullscreenPlayerRandomEpisodeButton = document.querySelector<HTMLButtonElement>('#fs-button-random')!


const playlist = document.querySelector<HTMLDialogElement>('#playlist')!
const playlistCloseButton = document.querySelector<HTMLImageElement>('#playlist-close-button')!
const playlistTitle = document.querySelector<HTMLHeadingElement>('#playlist-title')!
const playlistTracks = document.querySelector<HTMLParagraphElement>('#playlist-tracks')!
const playlistLinks = document.querySelector<HTMLParagraphElement>('#playlist-links')!

let curLink: HTMLAnchorElement | null = null

const hasMediaSession = (): boolean => {
  return "mediaSession" in navigator
}

const showPlayButton = () => {
  miniPlayerPlayButton.classList.remove(HIDDEN_CLASS)
  miniPlayerPauseButton.classList.add(HIDDEN_CLASS)
  fullscreenPlayerPlayButton.classList.remove(HIDDEN_CLASS)
  fullscreenPlayerPauseButton.classList.add(HIDDEN_CLASS)
}

const showPauseButton = () => {
  miniPlayerPlayButton.classList.add(HIDDEN_CLASS)
  miniPlayerPauseButton.classList.remove(HIDDEN_CLASS)
  fullscreenPlayerPlayButton.classList.add(HIDDEN_CLASS)
  fullscreenPlayerPauseButton.classList.remove(HIDDEN_CLASS)
}

mfpAudioPlayer.addEventListener('play', () => {
  console.log('Audio player is playing')
  navigator.mediaSession.playbackState = 'playing'
  _enableSeekAndPlaylistButtons()
})

mfpAudioPlayer.addEventListener('pause', () => {
  console.log('Audio player is paused')
  navigator.mediaSession.playbackState = 'paused'
  showPlayButton()
  _disableSeekAndPlaylistButtons()
})

mfpAudioPlayer.addEventListener('ended', () => {
  console.log('Audio player is ended')
  showPlayButton()
  _disableSeekAndPlaylistButtons()
})

mfpAudioPlayer.addEventListener('loadstart', () => {
  console.log('Audio player is loading')
})

mfpAudioPlayer.addEventListener('canplay', async () => {
  console.log('Audio player can play')
  await mfpAudioPlayer.play()
})

const _secondsToTime = (seconds: number): string => {

  if (isNaN(seconds) || seconds < 0) {
    return ZERO_ZERO_ZERO_TIME
  }

  const wholeSeconds = Math.floor(seconds)
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const secs = (wholeSeconds % 3600) % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

mfpAudioPlayer.addEventListener('timeupdate', () => {
  miniPlayerDuration.textContent = _secondsToTime(mfpAudioPlayer.currentTime)
  fullscreenPlayerDuration.textContent = _secondsToTime(mfpAudioPlayer.currentTime)
  //console.log('Audio player time update:', mfpAudioPlayer.currentTime, duration.textContent)
})

const _handlePlayerPause = (e: MouseEvent, button: HTMLButtonElement) => {
  e.preventDefault()

  if (button.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    console.log('Play button is disabled, ignoring click')
    return
  }
  console.log('Pause button clicked')
  mfpAudioPlayer.pause()
  showPlayButton()
}

miniPlayerPauseButton.addEventListener('click', (e: MouseEvent) => {
  _handlePlayerPause(e, miniPlayerPlayButton)
})

fullscreenPlayerPauseButton.addEventListener('click', (e: MouseEvent) => {
  _handlePlayerPause(e, fullscreenPlayerPauseButton)
})

const _handlePlayerPlay = (e: MouseEvent, button: HTMLButtonElement) => {
  e.preventDefault()
  if (button.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }
  mfpAudioPlayer.play()
  showPauseButton()
}

miniPlayerPlayButton.addEventListener('click', (e: MouseEvent) => {
  _handlePlayerPlay(e, miniPlayerPlayButton)
})

fullscreenPlayerPlayButton.addEventListener('click', (e: MouseEvent) => {
  _handlePlayerPlay(e, fullscreenPlayerPlayButton)
})

const _handleSeekBack = (e: MouseEvent, button: HTMLButtonElement) => {
  e.preventDefault()
  if (button.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }
  _seekBackward(SEEK_30_SECONDS)
}

miniPlayerSeekBackButton.addEventListener('click', (e: MouseEvent) => {
  _handleSeekBack(e, miniPlayerSeekBackButton)
})

fullscreenPlayerSeekBackButton.addEventListener('click', (e: MouseEvent) => {
  _handleSeekBack(e, fullscreenPlayerSeekBackButton)
})

const _handleSeekForward = (e: MouseEvent, button: HTMLButtonElement) => {
  e.preventDefault()
  if (button.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }
  _seekForward(SEEK_30_SECONDS)
}

miniPlayerSeekForwardButton.addEventListener('click', (e: MouseEvent) => {
  _handleSeekForward(e, miniPlayerSeekForwardButton)
})

fullscreenPlayerSeekForwardButton.addEventListener('click', (e: MouseEvent) => {
  _handleSeekForward(e, fullscreenPlayerSeekForwardButton)
})

miniPlayerRandomEpisodeButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()
  _playRandomEpisode()
})

fullscreenPlayerRandomEpisodeButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()
  _playRandomEpisode()
})

fullscreenPlayerPlaylistButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()

  if (fullscreenPlayerPlaylistButton.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }

  if (playlist) {
    playlist.style.display = "grid"
  }
})

fullscreenPlayerSkipPrevButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()

  if (fullscreenPlayerSkipPrevButton.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }

  console.log("Play previous episode...")
  const curIndex = Number(curLink?.dataset.index) - 1
  _playEpisode(curIndex)
})

fullscreenPlayerSkipNextButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()

  if (fullscreenPlayerSkipNextButton.classList.contains(PLAYER_CONTROLS_DISABLED_CLASS)) {
    return
  }

  console.log("Play next episode...")
  const curIndex = Number(curLink?.dataset.index) + 1
  _playEpisode(curIndex)
})

playlistCloseButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()
  if (playlist) {
    playlist.style.display = "none"
  }
})

const _enableSeekAndPlaylistButtons = () => {
  console.log('Enabling seek buttons')
  miniPlayerSeekBackButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  miniPlayerSeekForwardButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSeekBackButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSeekForwardButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSkipPrevButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSkipNextButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerPlaylistButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)

  // adjust fullscreen prev/next buttons  
  if (Number(curLink?.dataset.index) === 0) {
    console.log("\tDisable prev button...")
    fullscreenPlayerSkipPrevButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  }
  if (Number(curLink?.dataset.index) === (episodes.length - 1)) {
    console.log("\tDisable next button...")
    fullscreenPlayerSkipNextButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  }
}

const _disableSeekAndPlaylistButtons = () => {
  console.log('Disabling seek buttons')
  miniPlayerSeekBackButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  miniPlayerSeekForwardButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSeekBackButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSeekForwardButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSkipPrevButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSkipNextButton.classList.add(PLAYER_CONTROLS_DISABLED_CLASS)
}

const _enablePlayerControls = () => {
  miniPlayerSeekBackButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  miniPlayerSeekForwardButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  miniPlayerPlayButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  miniPlayerPauseButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  miniPlayerPlayButton.classList.add(HIDDEN_CLASS)
  miniPlayerPauseButton.classList.remove(HIDDEN_CLASS)

  fullscreenPlayerSeekBackButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSeekForwardButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSkipPrevButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerSkipNextButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerPlayButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerPauseButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
  fullscreenPlayerPlayButton.classList.add(HIDDEN_CLASS)
  fullscreenPlayerPauseButton.classList.remove(HIDDEN_CLASS)
  fullscreenPlayerPlaylistButton.classList.remove(PLAYER_CONTROLS_DISABLED_CLASS)
}

document.addEventListener('click', (e: MouseEvent) => {

  const element = e.target as HTMLElement

  const target = (element.tagName === 'DIV'
    && element.parentElement?.tagName === 'A') ? element.parentElement as HTMLAnchorElement
    : element as HTMLAnchorElement

  if (target.tagName === 'A' && target.href && target.dataset.title) {

    e.preventDefault()

    console.log('Episode Link clicked:', target.href)

    curLink = target

    console.log('curLink: ', curLink)
    console.log('target.dataset: ', target.dataset)

    try {
      const links = JSON.parse(target.dataset.links as string)
      console.log('Links:', links)
      const tracks = JSON.parse(target.dataset.tracks as string)
      console.log('Tracks:', tracks)

      playlistTracks.innerHTML = tracks.map((track: string) => {
        const url = `https://www.google.com/search?q=${encodeURIComponent('site:discogs.com ')}${encodeURIComponent(track)}`
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${track}</a>`
      }).join('\n')

      playlistLinks.innerHTML = links.map((link: string) => {
        return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`
      }).join('\n')

    } catch (e) {
      console.error('Error parsing links and tracks:', e)
    }

    const miniTitleText = `${target.dataset.title} [${target.dataset.duration}]`

    miniPlayerTitle.textContent = miniTitleText
    miniPlayerDuration.textContent = ZERO_ZERO_ZERO_TIME

    fullscreenPlayerTitle.textContent = target.dataset.title ?? "---------"
    fullscreenPlayerTitleDuration.textContent = target.dataset.duration ?? "--:--:--"
    fullscreenPlayerDuration.textContent = ZERO_ZERO_ZERO_TIME

    playlistTitle.innerHTML = target.dataset.title ?? "---------"

    mfpAudioPlayer.src = target.href
    mfpAudioPlayer.load()

    _enablePlayerControls()

    if (hasMediaSession()) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: miniTitleText,
        artist: "musicforprogramming.net",
        album: miniTitleText,
        artwork: [
          { src: "mfp.png" },
        ]
      })
    }
  }
})

document.addEventListener("visibilitychange", () => {
  console.log(`visibility change: ${document.visibilityState}`)
})

const _seekBackward = (offset: number) => {
  const currentTime = Math.floor(mfpAudioPlayer.currentTime - offset)
  console.log('Seeking backward:', currentTime, ' offset:', offset)
  mfpAudioPlayer.currentTime = Math.max(0, currentTime)
}

const _seekForward = (offset: number) => {
  const duration = Math.floor(mfpAudioPlayer.duration - 1)
  const currentTime = Math.floor(mfpAudioPlayer.currentTime + offset)
  console.log('Seeking forward:', currentTime, ' offset:', offset, ' duration:', duration)
  mfpAudioPlayer.currentTime = Math.min(duration, currentTime)
}

const _playRandomEpisode = () => {
  console.log("play random episode...")
  if (episodes.length > 0) {
    const index = Math.floor(Math.random() * episodes.length)
    _playEpisode(index)
  }
}

const _playEpisode = (index: number) => {
  console.log("play episode: ", index + 1)
  const episode = episodes[index] as HTMLAnchorElement
  episode.click()
}

if (hasMediaSession()) {
  const _updatePositionState = () => {
    navigator.mediaSession.setPositionState({
      duration: mfpAudioPlayer.duration,
      playbackRate: mfpAudioPlayer.playbackRate,
      position: mfpAudioPlayer.currentTime,
    })
  }

  navigator.mediaSession.setActionHandler('play', async () => {
    await mfpAudioPlayer.play()
    showPauseButton()
  })

  navigator.mediaSession.setActionHandler('pause', async () => {
    mfpAudioPlayer.pause()
    showPlayButton()
  })

  navigator.mediaSession.setActionHandler('stop', async () => {
    mfpAudioPlayer.pause()
    showPlayButton()
  })

  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    const skipTime = details.seekOffset || SEEK_30_SECONDS
    _seekBackward(skipTime)
    _updatePositionState()
  })

  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    const skipTime = details.seekOffset || SEEK_30_SECONDS
    _seekForward(skipTime)
    _updatePositionState()
  })

  navigator.mediaSession.setActionHandler('seekto', (details) => {
    const skipTime = details.seekTime || -1
    if (skipTime < 0 || skipTime > mfpAudioPlayer.duration) {
      console.warn('Invalid seek time:', skipTime)
      return
    }
    console.log('Seeking to:', skipTime)
    mfpAudioPlayer.currentTime = Math.floor(skipTime)
  })
}

fullscreenCloseButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()
  if (fullscreenPlayer) {
    fullscreenPlayer.style.display = "none"
  }
})

const _handleFullscreenOpen = (e: MouseEvent) => {
  e.preventDefault()
  if (fullscreenPlayer) {
    fullscreenPlayer.style.display = "grid"
  }
}

miniPlayerTitle.addEventListener('click', (e: MouseEvent) => {
  _handleFullscreenOpen(e)
})

miniPlayerFullscreenButton.addEventListener('click', (e: MouseEvent) => {
  _handleFullscreenOpen(e)
})

header.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()
  if (about) {
    about.style.display = "grid"
  }
})

aboutCloseButton.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault()
  if (about) {
    about.style.display = "none"
  }
})

