// TODOs:
// - manage queue of selections to read, "read to me now" or
// "read to me next"
// - highlight current word/sentence
// - intelligently detect blocks of text and ignore ads, photo
// captions, etc., https://mercury.postlight.com/web-parser/
// - stop speaking when the text's tab is closed

var currentRate = 1; // Default rate until we consult settings.
var currentText = '';
var currentIndex = 0;

chrome.storage.sync.get('speed', function(opt) {
  if ('speed' in opt) {
    currentRate = parseFloat(opt['speed']);
  } else {
    currentRate = 1;
  }
});

function read(text) {
  currentIndex = 0;
  currentText = text;
  chrome.tts.speak(text, {
    rate: currentRate,
    onEvent: function(evt) {
      console.log('event', evt.type);
      if (evt.errorMessage != undefined) { console.error(evt); return; }
      if (evt.charIndex == undefined) { return; }
      currentIndex = evt.charIndex;
    }
  });
}

function changeSpeed(newRate) {
  if (newRate > 3 || newRate < .25) { return; }
  // Stop speaking at the current rate, chop off the part that's already been
  // read, and begin speaking the rest at the new rate.
  chrome.tts.stop();
  currentRate = newRate;
  chrome.storage.sync.set({'speed': currentRate});
  console.log('new rate', newRate);
  read(currentText.substr(currentIndex));
}

chrome.contextMenus.create({
  title: 'Speak',
  contexts: ['selection'],
  onclick: function(info) { read(info.selectionText); },
}, null);

chrome.commands.onCommand.addListener(function(cmd) {
  console.log('command', cmd);
  switch(cmd) {
  case "startstop":
    chrome.tts.isSpeaking(function(speaking) {
      if (speaking) {
        chrome.tts.stop();
      } else {
        chrome.tabs.executeScript( {
          code: "window.getSelection().toString();"
        }, function(selection) {
          read(selection[0]);
        });
      }
    });
    break;
  case "faster": changeSpeed(currentRate + .25); break;
  case "slower": changeSpeed(currentRate - .25); break;
  }
});
