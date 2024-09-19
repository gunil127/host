let players = [
    { id: 1, bankroll: 1000, currentBet: { type: '', amount: 0 } },
    { id: 2, bankroll: 1000, currentBet: { type: '', amount: 0 } }
];
let currentPlayerIndex = 0;

document.getElementById('deal-button').addEventListener('click', function() {
    const betAmount = parseInt(document.getElementById('bet-amount').value);
    const selectedBet = document.querySelector('.bet.selected');

    if (!selectedBet) {
        alert('베팅할 항목을 선택하세요.');
        return;
    }

    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.currentBet.type = selectedBet.id.split('-')[0];
    currentPlayer.currentBet.amount = betAmount;

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > currentPlayer.bankroll) {
        alert('올바른 베팅 금액을 입력하세요.');
        return;
    }

    const playerCards = drawCards();
    const bankerCards = drawCards();
    
    const playerScore = calculateScore(playerCards);
    const bankerScore = calculateScore(bankerCards);

    document.getElementById('cards').innerHTML = `
        <p>플레이어 카드: ${playerCards.join(', ')} (합: ${playerScore})</p>
        <p>뱅커 카드: ${bankerCards.join(', ')} (합: ${bankerScore})</p>
    `;

    const result = determineWinner(playerScore, bankerScore);
    document.getElementById('result').innerText = result;
    document.getElementById('bankroll').innerText = `$${currentPlayer.bankroll}`;

    // 다음 플레이어로 전환
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
});

document.querySelectorAll('.bet').forEach(betElement => {
    betElement.addEventListener('click', function() {
        document.querySelectorAll('.bet').forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
    });
});

function drawCards() {
    const deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return [deck[Math.floor(Math.random() * deck.length)], deck[Math.floor(Math.random() * deck.length)]];
}

function calculateScore(cards) {
    let score = 0;
    for (const card of cards) {
        if (card === 'A') score += 1;
        else if (['K', 'Q', 'J', '10'].includes(card)) score += 0;
        else score += parseInt(card);
    }
    return score % 10; // 일의 자리만 계산
}

function determineWinner(playerScore, bankerScore) {
    const currentPlayer = players[currentPlayerIndex];
    if (playerScore > bankerScore) {
        currentPlayer.bankroll += currentPlayer.currentBet.amount; // 플레이어 승
        return '플레이어 승! 베팅액을 받았습니다.';
    } else if (bankerScore > playerScore) {
        if (currentPlayer.currentBet.type === 'banker') {
            currentPlayer.bankroll -= currentPlayer.currentBet.amount * 1.05; // 뱅커 승, 5% 수수료
        } else {
            currentPlayer.bankroll -= currentPlayer.currentBet.amount; // 다른 경우
        }
        return '뱅커 승! 베팅액을 잃었습니다.';
    } else {
        if (currentPlayer.currentBet.type === 'tie') {
            currentPlayer.bankroll += currentPlayer.currentBet.amount * 8; // 무승부, 8배 지급
            return '무승부! 베팅액의 8배를 받았습니다.';
        } else {
            return '무승부! 베팅액은 그대로 유지됩니다.';
        }
    }
}
