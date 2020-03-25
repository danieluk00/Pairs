let turnNumber = 1;
let cardsFound = 0;
let firstCard = null;
let firstCardValue = null;
let secondCard = null;
let secondCardValue = null;
let inPlay = true;
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
            e.target.src="/assets/card"+n+".jpeg"

            if (firstCard==null) {
                firstCard = e.target;
                firstCardValue = n;
                
                setTimeout(function(){ 
                    inPlay = true;
                }, 250);
            } else {
                secondCard = e.target;
                secondCardValue = n;

                if (firstCardValue==secondCardValue) {
                    setTimeout(function(){ 
                        cardsFound++;

                        if (cardsFound<14) {
                            animateCSS(firstCard.parentElement,'tada');
                            animateCSS(secondCard.parentElement,'tada');
                            firstCard.parentElement.classList.add('show');
                            secondCard.parentElement.classList.add('show');
                            resetTurn();
                        } else {
                            setTimeout(function(){ 
                                cards.forEach(card => {
                                    animateCSS(card,'flip');
                                })
                            }, 700);
                        }

                    }, 1100);
                }

                if (firstCardValue!=secondCardValue) {
                    setTimeout(function(){ 
                            animateCSS(firstCard.parentElement,'flipInY');
                            animateCSS(secondCard.parentElement,'flipInY');
                            firstCard.src = "../assets/card.jpeg"
                            secondCard.src = "../assets/card.jpeg"
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