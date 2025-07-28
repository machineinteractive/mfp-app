
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
const miniPlayButton = document.querySelector<HTMLButtonElement>('#mini-player-play-button')!
const miniStopButton = document.querySelector<HTMLButtonElement>('#mini-player-stop-button')!

const title = document.querySelector<HTMLParagraphElement>('#mini-player-title')!
const duration = document.querySelector<HTMLParagraphElement>('#mini-player-duration')!

let curLink: HTMLAnchorElement | null = null


function showMiniPlayButton() {
  miniPlayButton.classList.remove('hidden')
  miniStopButton.classList.add('hidden')
}

function showMiniStopButton() {
  miniPlayButton.classList.add('hidden')
  miniStopButton.classList.remove('hidden')
}


mfpAudioPlayer.addEventListener('play', () => {
  console.log('Audio player is playing')
  navigator.mediaSession.playbackState = 'playing'
})

mfpAudioPlayer.addEventListener('pause', () => {
  console.log('Audio player is paused')
  navigator.mediaSession.playbackState = 'paused'
})

mfpAudioPlayer.addEventListener('loadstart', () => {
  console.log('Audio player is loading')
})

mfpAudioPlayer.addEventListener('canplay', async () => {
  console.log('Audio player can play')
  await mfpAudioPlayer.play()
})


mfpAudioPlayer.addEventListener('timeupdate', () => {

  const wholeSeconds = Math.floor(mfpAudioPlayer.currentTime)
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor(wholeSeconds / 60)
  const seconds = wholeSeconds % 60

  duration.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  //console.log('Audio player time update:', mfpAudioPlayer.currentTime, duration.textContent)
})

miniStopButton.addEventListener('click', () => {
  console.log('Stop button clicked')
  mfpAudioPlayer.pause()
  showMiniPlayButton()
})

miniPlayButton.addEventListener('click', () => {
  console.log('Play button clicked')
  mfpAudioPlayer.play()
  showMiniStopButton()
})

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

    const titleText = target.innerText || 'Unknown Title'

    title.textContent = titleText
    duration.textContent = '00:00:00'

    mfpAudioPlayer.src = target.href
    mfpAudioPlayer.load()

    miniPlayButton.classList.add('hidden')
    miniStopButton.classList.remove('hidden')

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






