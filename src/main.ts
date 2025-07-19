// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

function hasMediaSession(): boolean {
  return "mediaSession" in navigator
}

const mfpAudioPlayer = document.querySelector<HTMLAudioElement>('#mfp-audio-player')!
const miniPlayButton = document.querySelector<HTMLButtonElement>('#mini-player-play-button')!
const miniStopButton = document.querySelector<HTMLButtonElement>('#mini-player-stop-button')!

const title = document.querySelector<HTMLParagraphElement>('#mini-player-title')!
const duration = document.querySelector<HTMLParagraphElement>('#mini-player-duration')!

let curLink: HTMLLinkElement | null = null


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
})
mfpAudioPlayer.addEventListener('loadstart', () => {
  console.log('Audio player is loading')
})
mfpAudioPlayer.addEventListener('canplay', () => {
  console.log('Audio player can play')
  mfpAudioPlayer.play()
})
mfpAudioPlayer.addEventListener('timeupdate', (event) => {

  const wholeSeconds = Math.floor(mfpAudioPlayer.currentTime)
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor(wholeSeconds / 60)
  const seconds = wholeSeconds % 60

  duration.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  console.log('Audio player time update:', mfpAudioPlayer.currentTime, duration.textContent)
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
  const target = event.target as HTMLLinkElement
  if (target.tagName === 'A' && target.href) {
    console.log('Link clicked:', target.href)

    curLink = target

    //window.open(target.href, '_blank');

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
          { src: "folder.png", sizes: "512x512", type: "image/png" },
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


