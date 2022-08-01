const video=document.querySelector('.video')
            videoControls=document.querySelector('.video-controls');
            playBtn=videoControls.querySelector('#play');
            playbackIcons=document.querySelectorAll('.playback-icon use')
            timeElapsed=document.querySelector('.time-elapsed')
            duration=document.querySelector('.duration')
            progressBar=document.getElementById('progress-bar')
            seek=document.getElementById('seek')
            seekToolTip=document.querySelector('#seek-tooltip')
            volumeButton=document.getElementById('volume-button')
            volumeIcons=document.querySelectorAll('.volume-button use')
            volumeMute=document.querySelector('use[href="#volume-mute"]')
            volumeLow=document.querySelector('use[href="#volume-low"]')
            volumeHigh=document.querySelector('use[href="#volume-high"]')
            volume=document.getElementById('volume-range')
            playbackAnimation=document.getElementById('playback-animation')
            fullscreenButton=document.getElementById('fullscreen-button')
            videoContainer=document.getElementById('video-container')
            fullscreenIcons=fullscreenButton.querySelectorAll('use')

videoContainer.addEventListener('fullscreenchange',updateFullScreenButton)
fullscreenButton.addEventListener('click', toggleFullScreen)
volumeButton.addEventListener('click', toggleMute)
video.addEventListener('volumechange', updateVolumeIcon)
video.addEventListener('click', animatePlayBack)
volume.addEventListener('input', updateVolume)
seek.addEventListener('input',skipAhead)
seek.addEventListener('mousemove',updateToolTip)
video.addEventListener('click',togglePlay)
playBtn.addEventListener('click',togglePlay)
video.addEventListener('play', updatePlayButton)
video.addEventListener('pause', updatePlayButton)
video.addEventListener('loadedmetadata',initializeVideo)
video.addEventListener('timeupdate',updateTimeElapsed)
video.addEventListener('timeupdate',updateProgress)
video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);

const videoWorks=!!document.createElement('video').canPlayType;
if(videoWorks){
    video.controls=false;
    videoControls.classList.remove('hidden')
}

function togglePlay(){
    if(video.paused || video.ended){
        video.play()
    }
    else{
        video.pause()
    }
}

function updatePlayButton(){
    playbackIcons.forEach(icon=>icon.classList.toggle('hidden'))

    if(video.paused){
        playBtn.setAttribute('data-title', 'play (k)')
      
    }
    else{
        playBtn.setAttribute('data-title', 'pause (k)')
    }
}

function formatTime(timeInSeconds){
    const result=new Date(timeInSeconds*1000).toISOString().substr(11, 8)

    return{
        minutes: result.substr(3,2),
        seconds: result.substr(6,2)
    }
}

function initializeVideo(){
    const videoDuration=Math.round(video.duration)
    seek.setAttribute('max',videoDuration)
    progressBar.setAttribute('max',videoDuration)
    const time=formatTime(videoDuration)
    duration.innerText=`${time.minutes}:${time.seconds}`
    duration.setAttribute('datetime',`${time.minutes}m ${time.seconds}s`)
}

function updateTimeElapsed(){
    const time=formatTime(Math.round(video.currentTime));
    timeElapsed.innerText=`${time.minutes}:${time.seconds}`
    timeElapsed.setAttribute('datetime',`${time.minutes}m ${time.seconds}s`)
}

function updateProgress(){
    seek.value=Math.floor(video.currentTime)
    progressBar.value=Math.floor(video.currentTime)
}

function updateToolTip(e){
    const skipTo=Math.round((e.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max')),10)
    seek.setAttribute('data-seek',skipTo)
    const t=formatTime(skipTo)
    seekToolTip.textContent=`${t.minutes}:${t.seconds}`
    const rect=video.getBoundingClientRect()
    seekToolTip.style.left=`${e.pageX - rect.left}px`
}

function skipAhead(e){
    const skipTo=e.target.dataset.seek ? e.target.dataset.seek : e.target.value
    video.currentTime=skipTo
    progressBar.value=skipTo
    seek.value=skipTo
}

function updateVolume(){
    if(video.muted){
        video.muted=false
    }
    video.volume=volume.value
}

function updateVolumeIcon(){
    volumeIcons.forEach(icon=>{
        icon.classList.add('hidden')
    })
    volumeButton.setAttribute('data-title', 'Mute (m)')

    if(video.muted || video.volume===0){
        volumeMute.classList.remove('hidden')
        volumeButton.setAttribute('data-title','Unmute (m)')
    }
    else if (video.volume >0 && video.volume <=0.5){
        volumeLow.classList.remove('hidden')
    }
    else{
        volumeHigh.classList.remove('hidden')
    }
}

function toggleMute(){
    video.muted=!video.muted

    if(video.muted){
        volume.setAttribute('data-volume', volume.value)
        volume.value=0
    }else{
        volume.value=volume.dataset.volume
    }
}

function animatePlayBack(){
    playbackAnimation.animate([
        {
            opacity:1,
            transform:'scale(1)'
        },
        {
            opacity:1,
            transform:'scale(1.3)'
        }
    ],{
        duration:500,
    })
}

function toggleFullScreen(){
    if(document.fullscreenElement){
        document.exitFullscreen
    }else if(document.webkitFullscreenElement){
        document.webkitExitFullscreen()
    }else if(videoContainer.webkitRequestFullscreen){
        videoContainer.webkitRequestFullscreen();
    }else{
        videoContainer.requestFullscreen()
    }
}

function updateFullScreenButton(){
    fullscreenIcons.forEach(icon=>icon.classList.toggle('hidden'))

    if(document.fullscreenElement){
        fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')

    } else {
    fullscreenButton.setAttribute('data-title', 'Full screen (f)')
  }
}

function hideControls() {
    if (video.paused) {
      return;
    }
  
    videoControls.classList.add('hide');
}

function showControls(){
    videoControls.classList.remove('hide')
}
