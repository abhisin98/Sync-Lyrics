// 1. ytplayer code: https://developers.google.com/youtube/player_parameters#IFrame_Player_API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubePlayerAPIReady(eid, vid) {
  player = new YT.Player(eid, {
    videoId: youtube_parser(vid),
    events: {
      'onStateChange': onPlayerStateChange
    }
  });

  function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7]: false;
  }

}
let mytimer
function onPlayerStateChange(events) {

  section3PreviewLyrics();
  /*if (player.getPlayerState() == YT.PlayerState.PLAYING && section3ItemRun) {
    /*mytimer = setInterval(function() {
    }, 0);*/
  /* } else {
    //clearTimeout(mytimer);
  }*/

  /*****/
  /*if (player.getPlayerState() == YT.PlayerState.PLAYING) {
    mytimer = setInterval(function() {
      $("#section1lyricsInput").val(player.playerInfo.currentTime);
    }, 0);
  } else {
    clearTimeout(mytimer);
  }*/
}

/********************************************************************************************* */

$(document).ready(function() {

  /****** temp ********/
  $("#section1linkInput").val("https://youtu.be/igiYeOPMdN0");
  $("#section1lyricsInput").val(iopkka)

  /****** *************/
  //$("#section1").hide();
  $("#section2").hide();
  $("#section3").hide();

  /**************** Section  1 ************ */
  let url

  $("#section1linkButton").click(function() {
    url = $("#section1linkInput").val();
    onYouTubePlayerAPIReady("section1Iframe", url);
  });


  let lyrics = [];

  $("#section1Button").click(function() {
    $("#section1").hide();
    $("#section2").show();
    player.pauseVideo();

    onYouTubePlayerAPIReady("section2Iframe", url);

    $("#section1lyricsInput").val().split("\n").filter(function(el) {
      return el;
    }).forEach(lyricsToArray);

    function lyricsToArray(item) {
      lyrics.push({
        id: create_UUID(),
        lyrics: item,
        startTime: "",
        endTime: "",
      });
    }
    console.log(lyrics)
    repiter(lyrics, "#section2Repiter3", "h5 text-secondary");

  });

  /**************** Section  2 ************ */
  $("#section2SpeedIncrease").click(function() {
    //Video PlaybackRate  increase
    let speed = player.getPlaybackRate() + 0.25;
    $('#section2Speedtext').html(speed);
    player.setPlaybackRate(speed);
  });
  $("#section2SpeedDecrease").click(function() {
    let speed = player.getPlaybackRate() - 0.25;
    $('#section2Speedtext').html(speed);
    player.setPlaybackRate(speed);
  });

  let lyrics3 = [];
  let lyrics2 = [];
  let status = false;

  $("#section2Button").click(function() {
    if (status) {
      player.pauseVideo();
      section3LyricsPrevew(lyrics3);

    } else {
      if (player.getPlayerState() == YT.PlayerState.PLAYING) {

        let elmnt = document.getElementById("section2Repiter2");
        elmnt.scrollIntoView({
          behavior: 'auto',
          block: 'start', //start, center, end
          inline: 'center'
        });

        if (lyrics2.length < 1) {
          console.log("start");

          lyrics2.push(lyrics.shift());
          // srtStart(lyrics2[0], player.playerInfo.currentTime);
          lyrics2[0].startTime = player.playerInfo.currentTime;
          statusBack = false;
        } else if (lyrics.length < 1) {
          console.log("end");

          lyrics2[0].endTime = player.playerInfo.currentTime;

          //srtEnd(player.playerInfo.currentTime)
          lyrics3.push(lyrics2.shift());
          status = true;
          console.log(lyrics3)
        } else {
          console.log("default");
          lyrics2[0].endTime = player.playerInfo.currentTime;

          //srtEnd(player.playerInfo.currentTime)
          lyrics3.push(lyrics2.shift());
          lyrics2.push(lyrics.shift());
          //srtStart(lyrics2[0], player.playerInfo.currentTime)
          lyrics2[0].startTime = player.playerInfo.currentTime;
        }
        repiter(lyrics, "#section2Repiter3", "h5 text-secondary");
        repiter(lyrics2, "#section2Repiter2", "h3");
        repiter(lyrics3, "#section2Repiter1", "h5 text-secondary");
        //console.log(lyrics, lyrics2, lyrics3)

      } else {
        player.playVideo();
      }
    }
  });

  let statusBack = false;

  $("#section2ButtonBack").click(function() {

    //Lyrics Sync Back

    if (statusBack) {} else {

      if (lyrics2.length < 1) {
        console.log("start back");

        lyrics2.unshify(lyrics3.pop());
        //srtStart(lyrics2[0], player.playerInfo.currentTime)
        player.seekTo(lyrics2[0].startTime);
      } else if (lyrics3.length < 1) {
        console.log("end back");

        //srtEnd(player.playerInfo.currentTime)
        lyrics.unshift(lyrics2.pop());
        status = false;
        statusBack = true;
        player.seekTo(lyrics[0].startTime);
        //console.log(makeSrt)
      } else {
        console.log("default back");

        // srtEnd(player.playerInfo.currentTime)
        lyrics.unshift(lyrics2.pop());
        lyrics2.unshift(lyrics3.pop());
        //srtStart(lyrics2[0], player.playerInfo.currentTime)
        player.seekTo(lyrics2[0].startTime);
      }
      repiter(lyrics, "#section2Repiter3", "h5 text-secondary");
      repiter(lyrics2, "#section2Repiter2", "h3");
      repiter(lyrics3, "#section2Repiter1", "h5 text-secondary");
      //console.log(lyrics, lyrics2, lyrics3)
    }
  });

  /**************** Section  3 ************ */
  function section3LyricsPrevew(item) {
    //player.playVideo();
    previewItem = item;
    section3ItemRun = true;
    $("#section2").hide();
    $("#section3").show();
    onYouTubePlayerAPIReady("section3Iframe",
      url);
  }

  $("#section3Button").click(function() {

    // Download Srt file
  });
});

/******************************************/
let previewItem
let section3ItemRun = false;
let play_subtitles
function section3PreviewLyrics() {
  // Bind the play and pause methods
  //this.on('play', function() {

  if (player.getPlayerState() == YT.PlayerState.PLAYING && section3ItemRun) {
    console.log(previewItem, "item")
    play_subtitles = setInterval(function() {
      var current_subtitle = 0;
      if (player.playerInfo.currentTime > previewItem[current_subtitle].endTime) {
        $("#section3PreviewLyrics").empty();
      }

      $.each(previewItem, function(index, subtitle) {
        if (subtitle.startTime > player.playerInfo.currentTime)
          return false;
        else if (subtitle.startTime < player.playerInfo.currentTime && subtitle.endTime >= player.playerInfo.currentTime) {
          if (index == current_subtitle) {
            return false;
          } else {
            current_subtitle = index;
            $("#section3PreviewLyrics").empty();
            let html = `<p class="h3 text-white">${subtitle.lyrics}</p>`;
            $("#section3PreviewLyrics").html(html);
            /*$.each(subtitle, function(index, value) {
              console.log(value, subtitle);
              //$("#section3PreviewLyrics").append(value + "<br />");
            });*/
          }
        }
      });
    }, 100);
  } else {
    clearTimeout(play_subtitles);
  }
}
/*******************************/


/**************** Function ************ */
function repiter(lyrics, repiterName, h) {
  let html = "";
  for (var i = 0; i < lyrics.length; i++) {
    html += `<p class="${h}">${lyrics[i].lyrics}</p>`
  }
  $(repiterName).html(html);
}

function create_UUID() {
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r: (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function timeX(timeInSeconds) {
  var pad = function(num, size) {
    return ('000' + num).slice(size * -1);
  },
  time = parseFloat(timeInSeconds).toFixed(3),
  hours = Math.floor(time / 60 / 60),
  minutes = Math.floor(time / 60) % 60,
  seconds = Math.floor(time - minutes * 60),
  milliseconds = time.slice(-3);

  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ',' + pad(milliseconds, 3);
}

/*let makeSrt = [];
let tempSrt

function srtStart(lyrics, startTime) {
  tempSrt = {
    id: create_UUID(),
    lyrics: lyrics,
    startTime: startTime,
    endTime: "",
  }
}

function srtEnd(endTime) {
  tempSrt.endTime = endTime;
  makeSrt.push(tempSrt);
}*/






/********************************************************************************************************************** */


let iopkka = `Do you love the rain, does it make you dance
When you're drunk with your friends at a party?
What's your favorite song, does it make you smile?
Do you think of me?

When you close your eyes, tell me, what are you dreamin'?
Everything, I wanna know it all

I'd spend ten thousand hours and ten thousand more
Oh, if that's what it takes to learn that sweet heart of yours
And I might never get there, but I'm gonna try
If it's ten thousand hours or the rest of my life
I'm gonna love you (Ooh, ooh-ooh, ooh, ooh)

Do you miss the road that you grew up on?
Did you get your middle name from your grandma?
When you think about your forever now, do you think of me?

When you close your eyes, tell me, what are you dreamin'?
Everything, I wanna know it all

I'd spend ten thousand hours and ten thousand more
Oh, if that's what it takes to learn that sweet heart of yours
And I might never get there, but I'm gonna try
If it's ten thousand hours or the rest of my life
I'm gonna love you (Ooh, ooh-ooh, ooh, ooh)
I'm gonna love you (Ooh, ooh-ooh, ooh, ooh)

Ooh, want the good and the bad and everything in between
Ooh, gotta cure my curiosity
Ooh, yeah

I'd spend ten thousand hours and ten thousand more
Oh, if that's what it takes to learn that sweet heart of yours (Sweet heart of yours)
And I might never get there, but I'm gonna try (Yeah)
If it's ten thousand hours or the rest of my life
I'm gonna love you (Ooh, ooh-ooh, ooh, ooh)
I'm gonna love you (Ooh, ooh-ooh, ooh, ooh)
Yeah
And I...
Do you love the rain, does it make you dance?
I'm gonna love you (I'm gonna love you)
I'm gonna love you`