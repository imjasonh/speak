// TODOs:
// - options page to set rate/gender/voice/volume
// - keyboard shortcuts to read faster/slower, pause/resume
// - manage queue of selections to read, "read to me now" or "read to me next"
// - highlight current word/sentence

chrome.contextMenus.create({
  title: 'Read to me',
  contexts: ['selection'],
  onclick: function(info) {
    chrome.tts.speak(info.selectionText, {
      rate: 2.0,
    });
  },
}, function() { /* TODO */ });
