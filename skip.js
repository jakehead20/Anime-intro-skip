// ==UserScript==
// @name Anime intro skip
// @description Press 'L' to skip the intro when it starts. You can press the minus/dash key on the number row of your keyboard to change settings. Keycodes can be found at keycode.info . Based off of https://greasyfork.org/en/scripts/30776-kissanime-skip-videos-90-seconds-skip-intro
// @namespace http://tampermonkey.net/
// @grant GM_setValue
// @grant GM_getValue
// @require https://greasyfork.org/scripts/370520-super-gm-set-and-get/code/Super%20GM%20set%20and%20get.js?version=614650
// @require http://code.jquery.com/jquery-1.7.1.min.js
// @include *rapidvideo.com*
// @include *mp4upload.com*
// @include *streamango.com*
// @include *vidstreaming.io*
// @include *kissanime.ru/Anime/*
// @version 1.0.0
// ==/UserScript==
$(document).ready(function(){
    console.log(window.self === window.top);
    let time = GM_SuperValue.get("skipTime", 85); // 1:25 just in case you're a little bit farther away from your keyboard :)
    let key = GM_SuperValue.get("keyCode", 76); // Key used to skip time
    let setkey = GM_SuperValue.get("settingkeyCode", 189); // Key used to change settings
    let changeSettings = function(){
        let timehold = time;
        let keyhold = key;
        time = prompt("How many seconds should we skip?", time);
        if(!time){
            time = timehold;
        }
        GM_SuperValue.set("skipTime", time);
        key = prompt("Keycode for skipping time (go to keycode.info for keycodes).", key);
        if(!key){
            key = keyhold;
        }
        GM_SuperValue.set("keyCode", key);
    };
    let url = window.location.href;
    if (typeof jwplayer === 'function'){
        let callback = function(e){
            if (e.which == key){
                jwplayer().seek(jwplayer().getPosition()+parseInt(time));
            }
            if (e.which == setkey){
                changeSettings();
            }
        };
        window.addEventListener('keydown', callback);
    }else{
        if (typeof videojs === 'function') {
            let vids = videojs.getPlayers();
            let player = vids[Object.keys(vids)[0]];
            let callback = function(e){
                if (e.which == key){
                    let player = vids[Object.keys(vids)[0]];
                    player.currentTime(player.currentTime()+parseInt(time));
                }else
                if (e.which == setkey){
                    changeSettings();
                }
            };
            player.ready(function(){
                window.addEventListener('keydown', callback);
            });
        }
    }
});