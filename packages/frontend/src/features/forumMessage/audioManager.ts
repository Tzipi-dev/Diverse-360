
let currentAudio: HTMLAudioElement | null = null;
let stopAnimationCallback: (() => void) | null = null;

export function stopCurrentAudio() {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
  if (stopAnimationCallback) {
    stopAnimationCallback();
    stopAnimationCallback = null;
  }
  currentAudio = null;
}

export function setCurrentAudio(
  audio: HTMLAudioElement,
  stopAnimation: () => void
) {
  if (currentAudio !== audio) {
    stopCurrentAudio();
    currentAudio = audio;
    stopAnimationCallback = stopAnimation;
  }
}
