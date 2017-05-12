// TODOs:
// - set gender/voice/lang
//
const keys = ['speed'];

chrome.storage.sync.get(keys, function(opt) {
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var el = document.getElementById(k);
    el.value = opt[k];
    update(k, opt[k]);
    el.onchange = function(e) {
      update(k, e.target.value);
      var x = {};
      x[k] = e.target.value;
      chrome.storage.sync.set(x);
    };
  }
});

function update(k, v) {
  var out = document.getElementById(k+'-out');
  if (out != undefined) {
    out.innerText = v;
  }
}
