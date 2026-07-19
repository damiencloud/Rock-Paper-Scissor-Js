console.log("script.js loaded successfully!");

// SVG Icons for choices
const choiceSVGs = {
    rock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><path d="M12 2L3 8l2 9 7 3 7-3 2-9-9-6z"/><path d="M12 2v20M3 8h18M5 17h14"/></svg>`,
    paper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    scissors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="9.8" y1="8.2" x2="20" y2="17"/><line x1="9.8" y1="15.8" x2="20" y2="7"/></svg>`
};

// Game state variables
let humanScore = 0;
let computerScore = 0;
let currentRound = 0;
const maxRounds = 5;

// DOM Elements
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const roundIndicatorEl = document.getElementById('round-indicator');
const playerChoicePreviewEl = document.getElementById('player-choice-preview');
const computerChoicePreviewEl = document.getElementById('computer-choice-preview');
const resultBannerEl = document.getElementById('result-banner');
const resultTextEl = document.getElementById('result-text');

// Modal Elements
const modalOverlayEl = document.getElementById('modal-overlay');
const modalEmojiEl = document.getElementById('modal-emoji');
const modalTitleEl = document.getElementById('modal-title');
const modalSubtitleEl = document.getElementById('modal-subtitle');
const modalPlayerScoreEl = document.getElementById('modal-player-score');
const modalComputerScoreEl = document.getElementById('modal-computer-score');
const btnRestartEl = document.getElementById('btn-restart');

// Weapon Buttons
const btnRock = document.getElementById('btn-rock');
const btnPaper = document.getElementById('btn-paper');
const btnScissors = document.getElementById('btn-scissors');

// Generates a random choice for the computer
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// Capitalize first letter helper
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Main game function per round
function playRound(humanChoice) {
    console.log("playRound called with choice:", humanChoice);
    if (currentRound >= maxRounds) return;

    currentRound++;
    const computerChoice = getComputerChoice();

    // Update round indicator
    roundIndicatorEl.textContent = `Round ${currentRound} of ${maxRounds}`;

    // Update Choice Previews
    playerChoicePreviewEl.innerHTML = choiceSVGs[humanChoice];
    computerChoicePreviewEl.innerHTML = choiceSVGs[computerChoice];

    // Reset preview classes
    playerChoicePreviewEl.className = 'choice-preview active';
    computerChoicePreviewEl.className = 'choice-preview active';

    // Clear previous outcome state styles
    resultBannerEl.className = 'result-banner';

    // Game Logic
    if (humanChoice === computerChoice) {
        // Draw
        resultBannerEl.classList.add('draw');
        resultTextEl.textContent = `It's a draw! Both chose ${capitalize(humanChoice)}.`;
    } 
    else if (
        (humanChoice === 'rock' && computerChoice === 'scissors') ||
        (humanChoice === 'paper' && computerChoice === 'rock') ||
        (humanChoice === 'scissors' && computerChoice === 'paper')
    ) {
        // Player wins
        humanScore++;
        resultBannerEl.classList.add('win');
        resultTextEl.textContent = `Round ${currentRound}: You win! ${capitalize(humanChoice)} beats ${capitalize(computerChoice)}.`;
        
        playerChoicePreviewEl.classList.add('win');
        computerChoicePreviewEl.classList.add('lose');
    } 
    else {
        // Computer wins
        computerScore++;
        resultBannerEl.classList.add('lose');
        resultTextEl.textContent = `Round ${currentRound}: You lose! ${capitalize(computerChoice)} beats ${capitalize(humanChoice)}.`;
        
        playerChoicePreviewEl.classList.add('lose');
        computerChoicePreviewEl.classList.add('win');
    }

    // Update scoreboard
    playerScoreEl.textContent = humanScore;
    computerScoreEl.textContent = computerScore;

    // Check for game end
    if (currentRound === maxRounds) {
        setTimeout(endGame, 1000); // Small delay to let the user see the final round result
    }
}

// Announces the final result
function endGame() {
    modalPlayerScoreEl.textContent = humanScore;
    modalComputerScoreEl.textContent = computerScore;

    // Clear modal title classes
    modalTitleEl.className = 'modal-title';

    if (humanScore > computerScore) {
        modalEmojiEl.textContent = '🎉';
        modalTitleEl.textContent = 'Victory!';
        modalTitleEl.classList.add('win');
        modalSubtitleEl.textContent = 'Superb! You outsmarted the computer.';
    } else if (computerScore > humanScore) {
        modalEmojiEl.textContent = '🤖';
        modalTitleEl.textContent = 'Defeat!';
        modalTitleEl.classList.add('lose');
        modalSubtitleEl.textContent = 'The computer won the match. Better luck next time!';
    } else {
        modalEmojiEl.textContent = '🤝';
        modalTitleEl.textContent = "It's a Tie!";
        modalTitleEl.classList.add('tie');
        modalSubtitleEl.textContent = 'An even match! Both scored the same.';
    }

    modalOverlayEl.classList.add('active');
}

// Resets game state to start a new match
function resetGame() {
    humanScore = 0;
    computerScore = 0;
    currentRound = 0;

    // Update UI elements to defaults
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    roundIndicatorEl.textContent = `Round 1 of ${maxRounds}`;
    
    playerChoicePreviewEl.innerHTML = '?';
    playerChoicePreviewEl.className = 'choice-preview';
    
    computerChoicePreviewEl.innerHTML = '?';
    computerChoicePreviewEl.className = 'choice-preview';
    
    resultBannerEl.className = 'result-banner';
    resultTextEl.textContent = 'Choose your weapon to start the match!';

    // Hide Modal Overlay
    modalOverlayEl.classList.remove('active');
}

// Event Listeners for Weapons
btnRock.addEventListener('click', () => playRound('rock'));
btnPaper.addEventListener('click', () => playRound('paper'));
btnScissors.addEventListener('click', () => playRound('scissors'));

// Event Listener for Restart Button
btnRestartEl.addEventListener('click', resetGame);