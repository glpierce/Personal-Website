const quoteArray = [`"Whoever fights monsters should see to it that in the process he does not become a monster. And if you gaze long enough into an abyss, the abyss will gaze back into you."
                    - Friedrich Nietzsche`,
                    `"The surest way to corrupt a youth is to instruct him to hold in higher esteem those who think alike than those who think differently."
                    - Friedrich Nietzsche`,
                    `"No one can construct for you the bridge upon which precisely you must cross the stream of life, no one but you yourself alone."
                    - Friedrich Nietzsce`,
                    `"You have your way. I have my way. As for the right way, the correct way, and the only way, it does not exist."
                    - Friedrich Nietzsche`,
                    `"Philosophy, as I have so far understood and lived it, means living voluntarily among ice and high mountains - seeking out everything strange and questionable in existence, everything so far placed under a ban by morality."
                    - Friedrich Nietzsche`,
                    `"In every walk with nature one receives far more than he seeks."
                    - John Muir`,
                    `"All we have to decide is what to do with the time that is given us."
                    - Gandlaf the Grey, JRR Tolkien`,
                    `"I feel all thin, sort of stretched, if you know what I mean: like butter that has been scraped over too much bread."
                    - Bilbo Baggins, JRR Tolkien`,
                    `"Faithless is he that says farewell when the road darkens."
                    - Gimli, JRR Tolkein`,
                    `"Do not go where the path may lead, go instead where there is no path and leave a trail."
                    - Ralph Waldo Emerson`,
                    `"In the end, it's not the years in your life that count. It's the life in your years."
                    - Abraham Lincoln`,
                    `"The only person you are destined to become is the person you decide to be."
                    - Ralph Waldo Emerson`,
                    `"The unexamined life is not worth living."
                    - Socrates`,
                    `"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment."
                    - Ralph Waldo Emerson`,
                    `"It's not what happens to you, but how you react to it that matters."
                    - Epictetus`,
                    `"Those who cannot remember the past are condemned to repeat it."
                    - George Santayana`,
                    `"Do or do not. There is no try."
                    - Master Yoda`,
                    `"As for me, I am tormented by an everlasting itch for things remote. I love to sail forbidden seas, and land on barbarous coasts."
                    - Herman Melville`
                    ];
generateQuote();

function generateQuote() {
    let quoteElement = document.createElement("p");
    quoteElement.textContent = quoteArray[randomIndex(quoteArray)];
    let quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.insertBefore(quoteElement, document.querySelector("#quoteDisplay button"));
}

function newQuote() {
    document.querySelector("#quoteDisplay p").remove();
    generateQuote();
}

function randomIndex(quotes) {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    return randomIndex;
}