let count = 1;

chrome.storage.sync.get(['count', 'onLoad'], result => {
  if(result.onLoad){
    execute(result.count)
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  switch(request.type){
    case 'COUNT':
      console.log(`Current count is ${request.payload.count}`);
      break;
    case 'ASSIFY':
      execute(request.payload.count)
      break;
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

function execute(responseCount){
  count = responseCount;
  console.log(`Execute assify with ${count} asses`);
  replaceNodeText(document.childNodes)
}

function assifyNode(assCount, node) {

  let pos = require('pos'),
      words = new pos.Lexer().lex(node.textContent),
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
            node.textContent = node.textContent.replace(new RegExp(word, 'g'), word + " " + replacement);
          }

          replaced.push(word);
      }
  }
}

function replaceNodeText(nodes) {
  for (let node of nodes) {
    if(node.nodeType === Node.TEXT_NODE){
      assifyNode(count, node)
    }else if(node.nodeName !== 'STYLE' && (node.nodeType === Node.DOCUMENT_NODE || Node.ELEMENT_NODE)){
      replaceNodeText(node.childNodes);
    }
  }
}