// 1. ytplayer code: https://developers.google.com/youtube/player_parameters#IFrame_Player_API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubePlayerAPIReady(eid, vid) {
  player = new YT.Player(eid, {
    videoId: youtube_parser(vid)
  });
  function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11)? match[7]: false;
  }
}
// 2. get player.playerInfo.currentTime
/*window.onclick = () => {
  console.log(player);
  //alert(player.playerInfo.currentTime);
}*/

$(document).ready(function() {

  /**********/
  $("#section1").hide();
  $("#section2").hide();
  $("#section3").hide();
  
  let url
  $("#sectionlinkButton").click(function() {
    url = $("#sectionlinkInput").val();
    onYouTubePlayerAPIReady("sectionIframe", url);
  });

  $("#sectionButtonNext").click(function() {
    $("#section").hide();
    $("#section1").show();
    onYouTubePlayerAPIReady("sectionIframe1", url);
  })
  let lyrics

  $("#button3").click(function() {
    $("#section1").hide();
    $("#section2").show();
    onYouTubePlayerAPIReady("sectionIframe2", url);
    lyrics = $("#lyricsInput").val().split("\n").filter(function (el) {
      return el;
    });
    console.log (lyrics)
    repiter(lyrics, "#repiter3", "h5 text-secondary");

  });

  $("#button1").click(function() {
    console.log(player.playerInfo.currentTime)
  });
  $("#button2").click(function() {});


  /********************/
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

  let lyrics3 = [];
  let lyrics2 = [];

  let status = false;
  $("#button5").click(function() {
    //player.playVideo();
    //console.log (player.playerInfo.currentTime, player)
    //console.log(timeX(player.playerInfo.currentTime))

    //console.log ('abhi', player.getPlayerState())

    if (player.getPlayerState() == YT.PlayerState.PLAYING) {

      if (status) {} else {
        //console.log ($('#masterrepiter'));

        let elmnt = document.getElementById("repiter2");
        elmnt.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

        if (lyrics2.length < 1) {
          console.log("start");

          lyrics2.push(lyrics.shift());
          srtStart(lyrics2[0], timeX(player.playerInfo.currentTime))
        } else if (lyrics.length < 1) {
          console.log("end");

          srtEnd(timeX(player.playerInfo.currentTime))
          lyrics3.push(lyrics2.shift());
          status = true;
          console.log(makeSrt)
        } else {
          console.log("default");

          srtEnd(timeX(player.playerInfo.currentTime))
          lyrics2.push(lyrics.shift());
          lyrics3.push(lyrics2.shift());
          srtStart(lyrics2[0], timeX(player.playerInfo.currentTime))
        }
        repiter(lyrics, "#repiter3", "h5 text-secondary");
        repiter(lyrics2, "#repiter2", "h3");
        repiter(lyrics3, "#repiter1", "h5 text-secondary");
        //console.log(lyrics, lyrics2, lyrics3)
      }
    } else {
      player.playVideo();
    }

  });

});
let makeSrt = [];
let tempSrt
function srtStart (lyrics, startTime) {
  tempSrt = {
    id: create_UUID(),
    lyrics: lyrics,
    startTime: startTime,
    endTime: "",
  }
}

function srtEnd (endTime) {
  tempSrt.endTime = endTime;
  makeSrt.push(tempSrt);
}


/**************/
function repiter (lyrics, repiterName, h) {
  let html = "";
  for (var i = 0; i < lyrics.length; i++) {
    html += `<p class="${h}">${lyrics[i]}</p>`
  }
  $(repiterName).html(html);

}

/*****/
function create_UUID() {
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (dt + Math.random()*16)%16 | 0;
    dt = Math.floor(dt/16);
    return (c == 'x' ? r: (r&0x3|0x8)).toString(16);
  });
  return uuid;
}