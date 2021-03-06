// ==UserScript==
// @name         AIS
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Page down to skip forward, Page up to skip backward (cause why not), end to change skip time, home to edit keybinds and skip time, delete to copy video source's URL. Works only on HTML5 videos for now.
// @author       jaek#9509
// @match        *://*/*
// @updateURL    https://github.com/jakehead20/AIS/raw/master/skip.user.js
// @downloadURL  https://github.com/jakehead20/AIS/raw/master/skip.user.js
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

(async function() {
    'use strict;'

    var get = GM.getValue;
    var set = GM.setValue
    var skipTime = await get("skipTime", 35);
    var forwardKey = await get("forwardKey", 34);
    var backKey = await get("backKey", 33);
    var copyKey = 45;
    var editKey = 36;
    document.addEventListener("keydown", function(e){
        var vid = document.getElementsByTagName("video")[0];
        if(vid == null) return;
        switch(e.keyCode){
            case forwardKey:
                vid.currentTime += skipTime;
                break;
            case backKey:
                vid.currentTime -= skipTime;
                break;
            case editKey:
                skipTime = Number(prompt("How much time to skip?", skipTime) || skipTime);
                forwardKey = Number(prompt("Key code for skipping forward? (Use keycode.info if you don't know what keycodes are)", forwardKey) || forwardKey);
                backKey = Number(prompt("Key code for skipping backward? (keycode.info for info)", backKey) || backKey);
                set("skipTime", skipTime);
                set("forwardKey", forwardKey);
                set("backKey", backKey);
                break;
            case copyKey:
                copyTextToClipboard(vid.src);
                break;
            default: return;
        }
    });
})();
