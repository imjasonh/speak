// TODOs:
// - options page to set rate/gender/voice/volume
// - keyboard shortcuts to read selection, read faster/slower, pause/resume
// - manage queue of selections to read, "read to me now" or "read to me next"
// - highlight current word/sentence
// - intelligently detect blocks of text and ignore ads, photo captions, etc.,
// https://mercury.postlight.com/web-parser/

var rate = 1.75;

function read(text) {
  chrome.tts.speak(text, {
    rate: rate
  });
}

chrome.contextMenus.create({
  title: 'Read to me',
  contexts: ['selection'],
  onclick: function(info) { read(info.selectionText); },
}, null);

chrome.commands.onCommand.addListener(function(cmd) {
  switch(cmd) {
  case "startstop":
    chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      chrome.tts.isSpeaking(function(speaking) {
        if (speaking) {
          chrome.tts.stop();
        } else {
          read(selection[0]);
        }
      });
    });
  case "faster": rate += .25;
  case "slower": rate -= .25;
  }

  if (rate < .1) { rate = .1; }
  if (rate > 2) { rate = 2; }
});
