// Load file
(function localFileVideoPlayer() {
  'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function(message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function(event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.querySelector('video')
    var canPlay = videoNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'Loaded file "' + file.name + '"'
    var isError = canPlay === 'no'
    displayMessage(message, isError)

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
})()

// Get a handle to the player
	player       = document.querySelector('video');
	btnPlayPause = document.querySelector('.playpause');
	btnMute      = document.querySelector('.mute');
	progressBar  = document.getElementById('progress-bar');
    volumeBar    = document.getElementById('volume-bar');
    btnFullScreen = document.querySelector('.fullscreen');
    btnReplay = document.querySelector('.repeat');
    btnStop = document.querySelector('.stop');
    btnPip = document.querySelector('.compact');
    btnPrevious = document.querySelector('.previous');
    btnNext = document.querySelector('.next');
// Get Music Metadata
player.addEventListener("change", function(event) {
  var file = event.target.files[0];
  $(".artwork").text(jsmediatags.read(file));
}, false);
btnPlayPause.addEventListener('click', () => {
  console.log('user requested video playback');
playPauseVideo()
});
btnMute.addEventListener('click', () => {
  console.log('user requested video mute');
muteVolume()
});
btnReplay.addEventListener('click', () => {
  console.log('user requested video replay');
replayVideo()
});
btnStop.addEventListener('click', () => {
  console.log('user requested video stop');
stopVideo()
});
// Fullscreen mode
btnFullScreen.addEventListener('click', () => {
  console.log('user requested fullscreen');

  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
// Picture-in-Picture mode
btnPip.addEventListener('click', () => {
  console.log('user requested pip');

  if (!document.pictureInPictureElement) {
    player.requestPictureInPicture();
  } else {
    document.exitPictureInPicture();
  }
});

btnPrevious.addEventListener('click', () => {
  console.log('user requested that the video skip backwards');
player.currentTime -= 5;
});
btnNext.addEventListener('click', () => {
  console.log('user requested that the video skip forward');
player.currentTime += 5;
});



window.SetVolume = function(val)
{
    player.volume = val / 100;
}
// Get duration metadata                     
  //player.preload = 'metadata';

player.addEventListener("loadedmetadata", function() {
    $(".time").text(player.duration);
});

$(".time").text("00:00");

	// Add a listener for the timeupdate event so we can update the progress bar
	player.addEventListener('timeupdate', updateProgressBar, false);
	
  
	player.addEventListener('ended', function() { this.pause(); }, false);	
  
  progressBar.addEventListener("click", seek);

  function seek(e) {
      var percent = e.offsetX / this.offsetWidth;
      player.currentTime = percent * player.duration;
      e.target.value = Math.floor(percent / 100);
      e.target.innerHTML = progressBar.value;
  }

  function playPauseVideo() {
  	if (player.paused || player.ended) {
  		player.play();
  	}
  	else {
  		player.pause();
  	}
  }
  
  // Stop the current media from playing, and return it to the start position
  function stopVideo() {
  	player.pause();
  	if (player.currentTime) player.currentTime = 0;
  }
  
  // Toggles the media player's mute and unmute status
  function muteVolume() {
  	if (player.muted) {
  		player.muted = false;
  	}
  	else {
  		player.muted = true;
  	}
  }
  
  // Replays the media currently loaded in the player
  function replayVideo() {
  	resetPlayer();
  	player.play();
  }
  
  // Update the progress bar
  function updateProgressBar() {
  	// Work out how much of the media has played via the duration and currentTime parameters
  	var percentage = Math.floor((100 / player.duration) * player.currentTime);
  	// Update the progress bar's value
  	progressBar.value = percentage;
  	// Update the progress bar's text (for browsers that don't support the progress element)
  	progressBar.innerHTML = percentage;
  }
  
  // Updates a button's title, innerHTML and CSS class
  function changeButtonType(btn, value) {
  	btn.title     = value;
  	btn.innerHTML = value;
  	btn.className = value;
  }
  
  function resetPlayer() {
  	progressBar.value = 0;
  	// Move the media back to the start
  	player.currentTime = 0;
  }  
  
  function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
  }
  
  function toggleFullScreen() {
    //var player = document.getElementById("player");

    if (player.requestFullscreen)
        if (document.fullScreenElement) {
            document.cancelFullScreen();
        } else {
            player.requestFullscreen();
        }
        else if (player.msRequestFullscreen)
        if (document.msFullscreenElement) {
            document.msExitFullscreen();
        } else {
            player.msRequestFullscreen();
        }
        else if (player.mozRequestFullScreen)
        if (document.mozFullScreenElement) {
            document.mozCancelFullScreen();
        } else {
            player.mozRequestFullScreen();
        }
        else if (player.webkitRequestFullscreen)
        if (document.webkitFullscreenElement) {
            document.webkitCancelFullScreen();
        } else {
            player.webkitRequestFullscreen();
        }
    else {
        alert("Fullscreen API is not supported");
        
    }
  }