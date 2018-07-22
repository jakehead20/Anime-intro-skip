// ==UserScript==
// @name Skip 85 seconds 'cause why not
// @description Press 'L' to skip the intro when it starts. Based off of https://greasyfork.org/en/scripts/30776-kissanime-skip-videos-90-seconds-skip-intro
// @namespace http://tampermonkey.net/
// @include *rapidvideo.com*
// @include *mp4upload.com*
// @include *streamango.com*
// @noframes
// @version 1.0.0
// ==/UserScript==

$(document).ready(function(){
    let time = 85 // 1:25 just in case you're a little bit farther away from your keyboard :)
    let key = 'l' // Key used to skip time
    if (typeof jwplayer === 'function'){
        jwplayer()
        window.addEventListener('keydown', function(e){
            if (e.key === key){
                jwplayer().seek(jwplayer().getPosition()+time)
            }
        })
    }else{
        if (videojs) {
            let vids = videojs.getPlayers()
            let player = vids[Object.keys(vids)[0]]
            player.ready(function(){
                window.addEventListener('keydown', function(e){
                    if (e.key === key){
                        player.currentTime(parseInt(player.currentTime())+time)
                    }
                })
            })
        }
    }
})