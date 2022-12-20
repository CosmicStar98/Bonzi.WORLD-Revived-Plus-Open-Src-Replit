importScripts('speakGenerator2.js');

onmessage = function(event) {
  postMessage(generateSpeech(event.data.text, event.data.args));
};
