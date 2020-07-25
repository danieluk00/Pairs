let turnNumber = 1;
let cardsFound = 0;
let firstCard = null;
let firstCardValue = null;
let secondCard = null;
let secondCardValue = null;
let inPlay = true;
let moves = 0;
const cards = document.querySelectorAll('.card')

const load = () => {

    let dealt = {};

    cards.forEach(card => {
    
        //Deal card
        let pick = Math.floor(Math.random() * 14) + 1
        do { 
            pick = Math.floor(Math.random() * 14) + 1
        }
        while (dealt[pick]>=2)

        (pick in dealt) ? dealt[pick] += 1 : dealt[pick] = 1;
        card.classList.add('card'+pick)

        //Add event listener
        card.addEventListener('click', e => {
            showCard(e);
        })
    })
}

const showCard = e => {

    if (inPlay==false || e.target==firstCard || e.target==secondCard || e.target.parentElement.classList.contains('show')) {return}
    inPlay = false;

    animateCSS(e.target.parentElement,'flipInY');

    for (let n=1; n<=14; n++) {
        if (e.target.parentElement.classList.contains('card'+n)) {
            e.target.src="assets/card"+n+".jpeg"

            if (firstCard==null) {
                firstCard = e.target;
                firstCardValue = n;
                
                setTimeout(function(){ 
                    inPlay = true;
                }, 250);
            } else {
                secondCard = e.target;
                secondCardValue = n;
                moves++;

                if (firstCardValue==secondCardValue) {
                    setTimeout(function(){ 
                        cardsFound++;

                        if (cardsFound<14) {
                            playAudio('correct.mp3');
                            animateCSS(firstCard.parentElement,'tada');
                            animateCSS(secondCard.parentElement,'tada');
                            firstCard.parentElement.classList.add('show');
                            secondCard.parentElement.classList.add('show');
                            resetTurn();
                        } else {
                            setTimeout(function(){ 
                                win();
                            }, 700);
                        }

                    }, 1100);
                }

                if (firstCardValue!=secondCardValue) {
                    setTimeout(function(){ 
                            animateCSS(firstCard.parentElement,'flipInY');
                            animateCSS(secondCard.parentElement,'flipInY');
                            firstCard.src = "assets/card.jpeg"
                            secondCard.src = "assets/card.jpeg"

                        playAudio('wrong.mp3');

                            resetTurn();
                    }, 1500);
                }
            }
        }
    }
}

const resetTurn = () => {
    firstCard = null;
    firstCardValue = null;
    secondCard = null;
    secondCardValue = null;
    inPlay = true;
}

function animateCSS(element, animationName, hide, callback) {
    element.classList.add('animated', animationName);

    if (hide=='show' && element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    }

    function handleAnimationEnd() {
        element.classList.remove('animated', animationName)
        element.removeEventListener('animationend', handleAnimationEnd)

        hide=='hide' ? element.classList.add('hidden') : "";

        if (typeof callback === 'function') callback()
    }

    element.addEventListener('animationend', handleAnimationEnd)
}

const playAgain = () => {
    moves = 0;
    turnNumber = 1;
    cardsFound = 0;
    inPlay=true;
    firstCard = null;
    firstCardValue = null;
    secondCard = null;
    secondCardValue = null;
    document.getElementById("overlay").style.display = "none";

    cards.forEach(card => {

        for (let n=1; n<=14; n++) {
            if (card.classList.contains('card'+n)) {
                card.classList.remove('card'+n);
            }
        }
        card.classList.remove('show');
        card.children[0].src="assets/card.jpeg"
        animateCSS(card,'pulse');

    })

    load();
}

const win = () => {

    playAudio('win.mp3');

    cards.forEach(card => {
        animateCSS(card,'flip');
    })
    setTimeout(function(){ 

        const highscore = parseInt(localStorage.getItem('highscore'));

        if (localStorage.getItem('highscore')==null) {
            document.getElementById('copy').innerText="You completed the board in " + moves + " moves."
            localStorage.setItem('highscore', moves);
        } else if (moves<highscore) {
            document.getElementById('copy').innerText="You completed the board in " + moves + " moves. That's a new personal best!"
            localStorage.setItem('highscore', moves);  
        } else if (moves>highscore) {
            document.getElementById('copy').innerText="You completed the board in " + moves + " moves. Your personal best is still "+localStorage.getItem('highscore')+"."
            localStorage.setItem('highscore', moves);  
        } else if (moves==highscore) {
            document.getElementById('copy').innerText="You completed the board in " + moves + " moves. You've matched your personal best!"
        }

 
        document.getElementById("overlay").style.display = "block";
        animateCSS(document.getElementById("overlay"),'fadeIn');
    }, 1000);
}

const playAudio = file => {
    // if (window.localStorage.getItem('audio')!='false') {
        let audio = new Audio('/assets/'+file);
        audio.play();
    // }
}