const quoteString = readQuotes ();
const quoteArray = toQuoteArray(quoteString);
let quoteElement = document.createElement("p");
quoteElement.textContent = quoteArray[randomIndex(quoteArray)];
let quoteDisplay = document.getElementById("quoteDisplay");
quoteDisplay.append(quoteElement);

function readQuotes () {
    
}

function toQuoteArray (quoteString) {
    const quoteArray = quoteString.split("\n");
    return quoteArray;
}

function randomIndex (quotes) {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    return randomIndex;
}


