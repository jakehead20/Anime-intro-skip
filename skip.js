// ==UserScript==
// @name Anime intro skip
// @description Press 'L' to skip the intro when it starts. You can press the minus/dash key on the number row of your keyboard to change settings. Keycodes can be found at keycode.info . Based off of https://greasyfork.org/en/scripts/30776-kissanime-skip-videos-90-seconds-skip-intro
// @namespace http://tampermonkey.net/
// @grant GM_setValue
// @grant GM_getValue
// @require http://userscripts-mirror.org/scripts/source/107941.user.js
// @include *rapidvideo.com*
// @include *mp4upload.com*
// @include *streamango.com*
// @noframes
// @version 1.0.5
// ==/UserScript==

$(document).ready(function(){
    let time = GM_SuperValue.get("skipTime", 85); // 1:25 just in case you're a little bit farther away from your keyboard :)
    let key = GM_SuperValue.get("keyCode", 76); // Key used to skip time
    let setkey = GM_SuperValue.get("settingkeyCode", 189); // Key used to change settings
    let changeSettings = function(){
        time = prompt("How many seconds should we skip?", time);
        GM_SuperValue.set("skipTime", time);
        key = prompt("Keycode for skipping time (go to keycode.info for keycodes).", key);
        GM_SuperValue.set("keyCode", key);
    };
    if (typeof jwplayer === 'function'){
        window.addEventListener('keydown', function(e){
            if (e.which === key){
                jwplayer().seek(jwplayer().getPosition()+time);
            }
            if (e.which === setkey){
                changeSettings();
            }
        });
    }else{
        if (typeof videojs === 'function') {
            let vids = videojs.getPlayers();
            let player = vids[Object.keys(vids)[0]];
            player.ready(function(){
                window.addEventListener('keydown', function(e){
                    if (e.which == key){
                        let player = vids[Object.keys(vids)[0]];
                        player.currentTime(parseInt(player.currentTime())+time);
                    }else
                    if (e.which == setkey){
                        changeSettings();
                    }
                });
            })
        }
    }
});