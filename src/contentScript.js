chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  switch(request.type){
    case 'COUNT':
      console.log(`Current count is ${request.payload.count}`);
      break;
    case 'ASSIFY':
      let count = request.payload.count;
      console.log(`Execute assify with ${count} asses`);
      assify(count);
      break;
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

function assify(assCount) {

  let div = document.querySelector('div');
  let text = div.innerHTML;
  let pos = require('pos'),
      words = new pos.Lexer().lex(text),
      tagger = new pos.Tagger(),
      taggedWords = tagger.tag(words),
      replaced = [];

  for (let i in taggedWords) {

      let taggedWord = taggedWords[i],
          word = taggedWord[0],
          tag = taggedWord[1],
          replacement = /[A-Z]/.test(word.charAt(0)) ? 'Ass' : 'ass';

      if(tag === 'JJ' && !replaced.includes(word)){
          for(let c = 0; c < assCount; c++){
            text = text.replace(new RegExp(word, 'g'), word + " " + replacement);
          }

          replaced.push(word);
      }
  }

  div.innerHTML = text;
}

function onLoad(){
  chrome.storage.sync.get(['count', 'onLoad'], result => {
    if(result.onLoad){
      assify(result.count);
    }
  });
}

onLoad();