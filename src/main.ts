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


const mfpAudioPlayer = document.querySelector<HTMLAudioElement>('#mfp-audio-player')!
const playButton = document.querySelector<HTMLButtonElement>('#mini-player-play-button')!
const stopButton = document.querySelector<HTMLButtonElement>('#mini-player-stop-button')!

const title = document.querySelector<HTMLParagraphElement>('#mini-player-title')!
const duration = document.querySelector<HTMLParagraphElement>('#mini-player-duration')!

let curLink: HTMLLinkElement | null = null

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

stopButton.addEventListener('click', () => {
  console.log('Stop button clicked')
  mfpAudioPlayer.pause()
  playButton.classList.remove('hidden')
  stopButton.classList.add('hidden')
})

playButton.addEventListener('click', () => {
  console.log('Play button clicked')
  mfpAudioPlayer.play()
  playButton.classList.add('hidden')
  stopButton.classList.remove('hidden')
})

document.addEventListener('click', (event) => {
  const target = event.target as HTMLLinkElement
  if (target.tagName === 'A' && target.href) {
    console.log('Link clicked:', target.href)

    curLink = target

    //window.open(target.href, '_blank');

    title.textContent = target.innerText || 'Unknown Title'
    duration.textContent = '00:00:00'

    mfpAudioPlayer.src = target.href
    mfpAudioPlayer.load()

    playButton.classList.add('hidden')
    stopButton.classList.remove('hidden')

    event.preventDefault()
  }
})