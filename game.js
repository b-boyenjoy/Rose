/**
 * Get Into Rose - A simple 2D game about getting into a club
 * Main game logic module
 */

// Game state
const gameState = {
    phase: 'menu', // menu, characterSelect, exploration, dialogue, gameover
    selectedCharacter: null,
    playerPosition: { x: 50, y: 400 },
    hasExplored: false,
    npcsInteracted: [],
    gameWon: false,
    sebbeInteracted: false,
    completedCharacters: new Set(), // Track completed characters
    gameCompleted: false // Track if overall game is completed
};

// DOM Elements
const gameScene = document.getElementById('game-scene');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueSpeaker = document.getElementById('speaker');
const dialogueText = document.getElementById('dialogue-text');
const dialogueOptions = document.getElementById('dialogue-options');
const menuScreen = document.getElementById('menu-screen');
const characterSelectScreen = document.getElementById('character-select-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverMessage = document.getElementById('game-over-message');
const startButton = document.getElementById('start-button');
const selectCharacterButton = document.getElementById('select-character-button');
const backToMenuButton = document.getElementById('back-to-menu-button');
const restartButton = document.getElementById('restart-button');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Make sure all elements exist before adding event listeners
    if (startButton) {
        startButton.addEventListener('click', showCharacterSelect);
    }
    
    if (selectCharacterButton) {
        selectCharacterButton.addEventListener('click', startGameWithSelectedCharacter);
    }
    
    if (backToMenuButton) {
        backToMenuButton.addEventListener('click', backToMainMenu);
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
    
    // Initialize the game once DOM is fully loaded
    initGame();
});

// Game initialization - create placeholder elements until we have proper assets
function initGame() {
    console.log('Initializing game...');
    
    // Ensure proper UI state - only menu should be visible initially
    if (dialogueBox) dialogueBox.classList.add('hidden');
    if (characterSelectScreen) characterSelectScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (menuScreen) menuScreen.classList.remove('hidden');
    
    // Initialize game environment
    initGameEnvironment();
    
    // Add the flicker animation if it doesn't exist yet
    addFlickerAnimation();
    
    // Initialize the character selection screen
    if (window.characterCreator && window.characterCreator.populateCharacterSelect) {
        window.characterCreator.populateCharacterSelect();
    } else {
        console.error('Character creator not loaded properly');
    }
    
    console.log('Game initialized successfully!');
    
    // Hide debug console
    const debugConsole = document.getElementById('debug-console');
    if (debugConsole) {
        debugConsole.style.display = 'none';
        debugConsole.classList.add('hidden');
    }
}

// Show character selection screen
function showCharacterSelect() {
    console.log('Showing character selection screen...');
    menuScreen.classList.add('hidden');
    characterSelectScreen.classList.remove('hidden');
    gameState.phase = 'characterSelect';
}

// Back to main menu from character selection
function backToMainMenu() {
    console.log('Returning to main menu...');
    characterSelectScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    gameState.phase = 'menu';
}

// Start the game with the selected character
function startGameWithSelectedCharacter() {
    const selectedCharacter = selectCharacterButton.dataset.selectedCharacter;
    
    if (!selectedCharacter) {
        console.error('No character selected');
        return;
    }
    
    console.log(`Starting game with character: ${selectedCharacter}`);
    
    // Set the player character in game state
    gameState.selectedCharacter = selectedCharacter;
    
    // Hide character selection screen
    characterSelectScreen.classList.add('hidden');
    
    // Start the game with the selected character
    startGame();
}

// Add a simple CSS animation for the sign
function addFlickerAnimation() {
    try {
        const styleSheet = document.styleSheets[0];
        let hasFlickerAnimation = false;
        
        // Check if animation already exists
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].name === 'flicker') {
                hasFlickerAnimation = true;
                break;
            }
        }
        
        if (!hasFlickerAnimation) {
            styleSheet.insertRule(`
                @keyframes flicker {
                    0%, 18%, 22%, 25%, 53%, 57%, 100% {
                        opacity: 1;
                    }
                    20%, 24%, 55% {
                        opacity: 0.5;
                    }
                }
            `, styleSheet.cssRules.length);
        }
    } catch (error) {
        console.error('Failed to add animation:', error);
    }
}

// Create doorman
function createDoorman() {
    // Use our character creator to generate a styled doorman
    const doorman = window.characterCreator.createDoormanCharacter();
    doorman.addEventListener('click', () => interactWithDoorman());
    gameScene.appendChild(doorman);
}

// Create NPCs
function createNPCs() {
    // Create blonde girl at the door
    const blondeGirl = window.characterCreator.createNPCCharacter('blondeGirl', {
        left: '550px',  // Moved to be under the ROSE text
        bottom: '150px'
    });
    blondeGirl.addEventListener('click', () => {
        showDialogue('Blonde Girl', "I wish I could help you out but my contact is now at spy bar!", [
            { text: 'Ok, thanks anyway', action: () => hideDialogue() }
        ]);
    });
    gameScene.appendChild(blondeGirl);
    
    // Create conspiracy nut
    const conspiracyNut = window.characterCreator.createNPCCharacter('conspiracyNut', {
        left: '300px',
        bottom: '170px'
    });
    conspiracyNut.addEventListener('click', () => interactWithNPC('conspiracyNut'));
    gameScene.appendChild(conspiracyNut);
    
    // Create failed DJ
    const failedDJ = window.characterCreator.createNPCCharacter('failedDJ', {
        left: '150px',
        bottom: '170px'
    });
    failedDJ.addEventListener('click', () => interactWithNPC('failedDJ'));
    gameScene.appendChild(failedDJ);
}

// Create player character
function createPlayerCharacter() {
    // Use our character creator to generate a styled player character
    const player = window.characterCreator.createPlayerCharacter(gameState.selectedCharacter, {
        x: gameState.playerPosition.x,
        y: gameState.playerPosition.y
    });
    
    // Set initial position
    player.style.left = gameState.playerPosition.x + 'px';
    player.style.bottom = gameState.playerPosition.y + 'px';
    
    // Add walking animation - subtle movement when walking
    let walkingInterval;
    
    player.startWalking = function() {
        player.setAttribute('data-walking', 'true');
        
        // Create a subtle walking animation by moving body parts slightly
        clearInterval(walkingInterval);
        let step = 0;
        walkingInterval = setInterval(() => {
            if (player.getAttribute('data-walking') !== 'true') {
                clearInterval(walkingInterval);
                return;
            }
            
            // Get legs and adjust their position slightly
            const legs = player.querySelectorAll('.character-leg');
            if (legs.length >= 2) {
                if (step % 2 === 0) {
                    legs[0].style.top = `${105 + 3}px`;
                    legs[1].style.top = `${105 - 3}px`;
                } else {
                    legs[0].style.top = `${105 - 3}px`;
                    legs[1].style.top = `${105 + 3}px`;
                }
            }
            
            // Get arms and adjust their rotation slightly
            const arms = player.querySelectorAll('.character-arm');
            if (arms.length >= 2) {
                if (step % 2 === 0) {
                    arms[0].style.transform = 'rotate(5deg)';
                    arms[1].style.transform = 'rotate(-5deg)';
                } else {
                    arms[0].style.transform = 'rotate(-5deg)';
                    arms[1].style.transform = 'rotate(5deg)';
                }
            }
            
            step++;
        }, 200);
    };
    
    player.stopWalking = function() {
        player.setAttribute('data-walking', 'false');
        
        // Reset positions of body parts
        const legs = player.querySelectorAll('.character-leg');
        if (legs.length >= 2) {
            legs[0].style.top = '105px';
            legs[1].style.top = '105px';
        }
        
        const arms = player.querySelectorAll('.character-arm');
        if (arms.length >= 2) {
            arms[0].style.transform = 'rotate(0deg)';
            arms[1].style.transform = 'rotate(0deg)';
        }
    };
    
    // Add to the scene
    gameScene.appendChild(player);
    
    // Add movement controls
    document.addEventListener('keydown', handlePlayerMovement);
    
    return player;
}

// Handle player movement
function handlePlayerMovement(e) {
    if (gameState.phase !== 'exploration') return;
    
    const player = document.getElementById('player');
    if (!player) return; // Safety check
    
    // Auto-trigger doorman interaction for Sebbe after a tiny movement
    if (gameState.selectedCharacter === 'sebbe' && !gameState.sebbeInteracted) {
        // Let Sebbe move just a tiny bit before triggering
        const speed = 10;
        switch(e.key) {
            case 'ArrowLeft':
                gameState.playerPosition.x = Math.max(50, gameState.playerPosition.x - speed);
                player.style.transform = 'scaleX(-1)'; // Face left
                break;
            case 'ArrowRight':
                gameState.playerPosition.x = Math.min(700, gameState.playerPosition.x + speed);
                player.style.transform = ''; // Face right (default)
                break;
            case 'ArrowUp':
                gameState.playerPosition.y = Math.min(400, gameState.playerPosition.y + speed);
                break;
            case 'ArrowDown':
                gameState.playerPosition.y = Math.max(150, gameState.playerPosition.y - speed);
                break;
        }
        
        // Update position
        player.style.left = gameState.playerPosition.x + 'px';
        player.style.bottom = gameState.playerPosition.y + 'px';
        
        // Mark interaction and trigger doorman
        gameState.sebbeInteracted = true;
        setTimeout(() => interactWithDoorman(), 100); // Tiny delay for natural feel
        return;
    }
    
    const speed = 10;
    let isMoving = false;
    
    switch(e.key) {
        case 'ArrowLeft':
            gameState.playerPosition.x = Math.max(50, gameState.playerPosition.x - speed);
            player.style.transform = 'scaleX(-1)'; // Face left
            isMoving = true;
            break;
        case 'ArrowRight':
            gameState.playerPosition.x = Math.min(700, gameState.playerPosition.x + speed);
            player.style.transform = ''; // Face right (default)
            isMoving = true;
            break;
        case 'ArrowUp':
            gameState.playerPosition.y = Math.min(400, gameState.playerPosition.y + speed);
            isMoving = true;
            break;
        case 'ArrowDown':
            gameState.playerPosition.y = Math.max(150, gameState.playerPosition.y - speed);
            isMoving = true;
            break;
    }
    
    // Update position
    player.style.left = gameState.playerPosition.x + 'px';
    player.style.bottom = gameState.playerPosition.y + 'px';
    
    // Animate walking
    if (isMoving && player.getAttribute('data-walking') !== 'true') {
        player.startWalking();
    }
    
    // Check if player is near the doorman
    const doorman = document.getElementById('doorman');
    if (doorman) {
        const doormanRect = doorman.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        if (
            Math.abs(playerRect.left - doormanRect.left) < 100 &&
            Math.abs(playerRect.top - doormanRect.top) < 100
        ) {
            interactWithDoorman();
        }
    }
    
    // Check if player is near any NPCs
    document.querySelectorAll('.npc').forEach(npc => {
        const npcRect = npc.getBoundingClientRect();
        if (
            Math.abs(playerRect.left - npcRect.left) < 60 &&
            Math.abs(playerRect.top - npcRect.top) < 60
        ) {
            interactWithNPC(npc.dataset.npcId);
        }
    });
}

// Stop walking when key is released
document.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        const player = document.getElementById('player');
        if (player && typeof player.stopWalking === 'function') {
            player.stopWalking();
        }
    }
});

// Start the game
function startGame() {
    console.log('Starting game...');
    
    gameState.phase = 'exploration';
    gameState.sebbeInteracted = false;
    
    // Reset player position to top left corner
    gameState.playerPosition = { x: 50, y: 400 };
    
    createPlayerCharacter();
    
    // Update hint message using selectedCharacter
    const characterName = window.characterCreator.CHARACTERS[gameState.selectedCharacter].name;
    const hintMessage = characterName === 'Sebbe' 
        ? "You're playing as Sebbe. Just start walking and see what happens!"
        : `You're playing as ${characterName}. Talk to people around the club or go directly to the doorman.`;
    
    showDialogue('Game', hintMessage, [
        { text: 'Let\'s explore!', action: () => hideDialogue() }
    ]);
    
    console.log('Game started!');
}

// Show dialogue
function showDialogue(speaker, text, options) {
    gameState.phase = 'dialogue';
    dialogueSpeaker.textContent = speaker;
    dialogueText.textContent = text;
    dialogueOptions.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option.text;
        button.addEventListener('click', option.action);
        dialogueOptions.appendChild(button);
    });
    
    dialogueBox.classList.remove('hidden');
}

// Hide dialogue
function hideDialogue() {
    dialogueBox.classList.add('hidden');
    gameState.phase = 'exploration';
}

// NPC interactions
function interactWithNPC(npcId) {
    // Only register interaction once for exploration info
    if (gameState.npcsInteracted.includes(npcId)) return;
    
    gameState.hasExplored = true;
    gameState.npcsInteracted.push(npcId);
    
    // Get the selected character
    const characterData = window.characterCreator.CHARACTERS[gameState.selectedCharacter];
    
    switch(npcId) {
        case 'regular':
            showDialogue('Club Regular', 'Sebbe\'s here every night; the doorman loves him.', [
                { text: 'Good to know!', action: () => hideDialogue() }
            ]);
            break;
        case 'conspiracyNut':
            showDialogue('Conspiracy Theorist', 'Rose is an alien base! Don\'t go in!', [
                { text: 'Uh... thanks for the warning.', action: () => hideDialogue() }
            ]);
            break;
        case 'failedDJ':
            showDialogue('Failed DJ', 'They rejected my mixtape, but Rose Punch is still fire.', [
                { text: 'Sorry to hear that.', action: () => hideDialogue() }
            ]);
            break;
    }
}

// Update doorman interaction with correct dialogue paths
function interactWithDoorman() {
    const currentCharacter = gameState.selectedCharacter;
    
    if (!currentCharacter) {
        console.error('No character selected');
        return;
    }
    
    switch (currentCharacter) {
        case 'sebbe':
            showDialogue('Doorman', 'Sebbe! My man! Come on in!', [
                { text: 'Thanks bro!', action: () => winGame('Sebbe walks right in like he owns the place! 🎉') }
            ]);
            break;
            
        case 'mayo':
            showDialogue('Doorman', 'Hey! Who is this boyyyy?', [
                { text: 'Its Maddafkn Mayo', action: () => loseGame('The doorman didn\'t like your answer!') },
                { text: 'Its Max Forsvall', action: () => loseGame('The doorman didn\'t like your answer!') },
                { text: 'Max Forsvallar finns inte', action: () => {
                    showDialogue('Doorman', 'Heh, you got it. Why should I let you in?', [
                        { text: 'I will play tunes here tonight', action: () => winGame('Welcome to Rose, DJ Mayo! 🎵') },
                        { text: 'My girl is inside', action: () => loseGame('The doorman didn\'t like your answer!') },
                        { text: 'I will get this club goiiing!', action: () => loseGame('The doorman didn\'t like your answer!') }
                    ]);
                }}
            ]);
            break;
            
        case 'henke':
            showDialogue('Doorman', "You're new here! I haven't seen you in Rose before. What's your three best properties?", [
                {
                    text: "Im nice",
                    action: () => {
                        showDialogue('Doorman', "Not bad, newcomer. I got one more question for you. What would you choose? To give or take?", [
                            { text: "To give", action: () => loseGame("Haha, go back to Styrmansgatan.") },
                            { text: "To take", action: () => loseGame("Haha, go back to Styrmansgatan.") },
                            { text: "Both", action: () => winGame("You are welcome in, let me see that booty shake! 🎉") }
                        ]);
                    }
                },
                { text: "Im the second-best seller at Fenix", action: () => loseGame("Haha, go back to Styrmansgatan.") },
                { text: "I can split the G", action: () => loseGame("Haha, go back to Styrmansgatan.") }
            ]);
            break;
            
        case 'wugk':
            showDialogue('Doorman', "Wugk, it's 4 o'clock, we're closing in 1 hour. Why should I let you in?", [
                { text: "I will invite you to the wedding", action: () => loseGame("Yeah, no. Beat it, the only song you'll be listening to is Boulevard of Broken Dreams on the way home.") },
                { text: "I need to hear hovet one more time this night", action: () => winGame("Fine, get in for the last tunes big boy! 🎉") },
                { text: "I need to hear lovet one more time this night", action: () => loseGame("Yeah, no. Beat it, the only song you'll be listening to is Boulevard of Broken Dreams on the way home.") }
            ]);
            break;
            
        case 'venneman':
            showDialogue('Doorman', "Is it a ghost from the past returning to Rose? Why should I let you in?", [
                {
                    text: "Because I have just launched my MACKBAR!!",
                    action: () => {
                        showDialogue('Doorman', "Ha! Good one. I just wonder one more thing. What happened to the Friday frog?", [
                            { text: "I locked him in with my fishes.", action: () => loseGame("That was painful. Get lost.") },
                            { text: "We lost contact. I will contact him again and send memes every friday", action: () => winGame("Good! Don't miss the meme next Friday! Welcome in! 🐸") },
                            { text: "I have been working too much with my mackbar and lost contact with him", action: () => loseGame("That was painful. Get lost.") }
                        ]);
                    }
                },
                { text: "Hilda kicked me out for the night", action: () => loseGame("That was painful. Get lost.") },
                { text: "I miss the red-room", action: () => loseGame("That was painful. Get lost.") }
            ]);
            break;
            
        case 'linkan':
            showDialogue('Doorman', "Linkan, I heard about you. Why should I let you in?", [
                {
                    text: "I can buy this place with one month's salary",
                    action: () => {
                        showDialogue('Doorman', "Give me some inside info and I will let you in.", [
                            { text: "You should always have immunovia in your portfolio", action: () => winGame("Welcome to Rose! 💰") },
                            { text: "I rather go to spybar", action: () => loseGame("Go and take some lessons with Robin Omega before you enter this club.") },
                            { text: "Buy my online course \"Linkish x2000 sug den plus\" and I give you advice", action: () => loseGame("Go and take some lessons with Robin Omega before you enter this club.") }
                        ]);
                    }
                },
                { text: "I am good with my hands", action: () => loseGame("Go and take some lessons with Robin Omega before you enter this club.") },
                { text: "I like to harvest plants", action: () => loseGame("Go and take some lessons with Robin Omega before you enter this club.") }
            ]);
            break;
            
        case 'mans':
            showDialogue('Doorman', "Måns, Sebbe and the gang already went in! Why are you late?", [
                { text: "The taxi drove the wrong way", action: () => winGame("Haha always the fkn cab. Welcome to Rose! 🚕") },
                { text: "Lasse wouldn't let me leave the apartment", action: () => loseGame("Nice try, but no dice. Get a cab home that knows the way.") },
                { text: "I needed to raid with the boys.", action: () => loseGame("Nice try, but no dice. Get a cab home that knows the way.") }
            ]);
            break;
            
        default:
            showDialogue('Doorman', 'Who are you? I don\'t think I can let you in tonight.', [
                { text: 'Maybe another time', action: () => hideDialogue() }
            ]);
    }
}

// Win the game
function winGame(message = '') {
    if (gameState.selectedCharacter) {
        gameState.completedCharacters.add(gameState.selectedCharacter);
    }
    
    // Check if player has completed at least two characters
    if (gameState.completedCharacters.size >= 2) {
        gameState.gameCompleted = true;
        showGameOverScreen(
            "Congratulations! You made it into Rose! 🎉\n\n" +
            `Characters who made it in: ${Array.from(gameState.completedCharacters).join(', ')}`
        );
    } else {
        // Show success for individual character but prompt for more
        const remainingNeeded = 2 - gameState.completedCharacters.size;
        showGameOverScreen(
            message + "\n\n" +
            `Great job! You got in with ${gameState.selectedCharacter}!\n` +
            `Get in with ${remainingNeeded} more character${remainingNeeded > 1 ? 's' : ''} to prove you're a true Rose regular!`
        );
    }
    
    // Reset character selection state
    gameState.selectedCharacter = null;
    
    // Update character selection screen to show new completion status
    updateCharacterSelectScreen();
}

// Show game over screen with custom message
function showGameOverScreen(message) {
    gameState.phase = 'gameover';
    gameOverMessage.textContent = message;
    
    // Update the restart button text based on game state
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.textContent = gameState.gameCompleted ? 
            "Start Over" : 
            "Try to get in with another character?";
    }
    
    // Ensure only game over screen is visible
    dialogueBox.classList.add('hidden');
    menuScreen.classList.add('hidden');
    characterSelectScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Lose the game
function loseGame(message) {
    gameState.gameWon = false;
    gameState.phase = 'gameover';
    
    // Get character name for the losing message
    const characterName = window.characterCreator.CHARACTERS[gameState.selectedCharacter].name;
    gameOverMessage.textContent = `${message || `${characterName} didn't make it into Rose tonight.`} Better luck next time!`;
    
    // Ensure only game over screen is visible
    dialogueBox.classList.add('hidden');
    menuScreen.classList.add('hidden');
    characterSelectScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Restart the game
function restartGame() {
    console.log('Restarting game...');
    
    // If game is completed, reset everything
    if (gameState.gameCompleted) {
        gameState.completedCharacters.clear();
        gameState.gameCompleted = false;
        
        // Only in case of complete reset, rebuild the entire scene
        while (gameScene.firstChild) {
            gameScene.removeChild(gameScene.firstChild);
        }
        initGameEnvironment();
    } else {
        // Just remove the player character
        const player = document.getElementById('player');
        if (player) {
            player.remove();
        }
    }
    
    // Reset game state
    gameState.phase = 'characterSelect';
    gameState.selectedCharacter = null;
    gameState.hasExplored = false;
    gameState.npcsInteracted = [];
    gameState.gameWon = false;
    gameState.playerPosition = { x: 50, y: 400 };
    gameState.sebbeInteracted = false;
    
    // Update UI
    hideDialogue();
    gameOverScreen.classList.add('hidden');
    characterSelectScreen.classList.remove('hidden');
    
    // Update character select screen with current completion status
    updateCharacterSelectScreen();
}

// Separate environment initialization from game initialization
function initGameEnvironment() {
    // Create a simple placeholder for the background if image fails to load
    gameScene.style.backgroundColor = '#333';
    
    // Create club entrance
    const clubEntrance = document.createElement('div');
    clubEntrance.className = 'club-entrance';
    clubEntrance.style.position = 'absolute';
    clubEntrance.style.width = '150px';
    clubEntrance.style.height = '250px';
    clubEntrance.style.right = '150px';
    clubEntrance.style.bottom = '150px';
    clubEntrance.style.backgroundColor = '#222';
    clubEntrance.style.borderLeft = '5px solid #ff00ff';
    clubEntrance.style.borderRight = '5px solid #ff00ff';
    clubEntrance.style.borderTop = '5px solid #ff00ff';
    gameScene.appendChild(clubEntrance);
    
    // Add club name
    const clubSign = document.createElement('div');
    clubSign.textContent = 'ROSE';
    clubSign.style.position = 'absolute';
    clubSign.style.top = '30px';
    clubSign.style.width = '100%';
    clubSign.style.textAlign = 'center';
    clubSign.style.color = '#ff00ff';
    clubSign.style.fontSize = '36px';
    clubSign.style.fontWeight = 'bold';
    clubSign.style.textShadow = '0 0 10px #ff00ff, 0 0 20px #ff00ff';
    clubSign.style.animation = 'flicker 2s infinite alternate';
    clubEntrance.appendChild(clubSign);
    
    // Create the doorman
    createDoorman();
    
    // Create NPCs
    createNPCs();
    
    // Add touch controls
    addTouchControls();
}

// Update character selection functionality
function selectCharacter(characterId) {
    // Enable the select button and store the selected character
    const selectButton = document.getElementById('select-character-button');
    if (selectButton) {
        selectButton.disabled = false;
        selectButton.dataset.selectedCharacter = characterId;
    }
    
    // Update character description
    const descriptionElement = document.getElementById('character-description');
    if (descriptionElement && window.characterCreator.CHARACTERS[characterId]) {
        descriptionElement.textContent = window.characterCreator.CHARACTERS[characterId].description || '';
    }
    
    // Update visual selection state
    document.querySelectorAll('.character-option').forEach(button => {
        button.classList.remove('selected');
        if (button.dataset.character === characterId) {
            button.classList.add('selected');
        }
    });
}

// Update character select screen with completion status
function updateCharacterSelectScreen() {
    const characterList = document.getElementById('character-list');
    if (!characterList) return;
    
    // Clear existing characters
    characterList.innerHTML = '';
    
    // Reset select button state
    const selectButton = document.getElementById('select-character-button');
    if (selectButton) {
        selectButton.disabled = true;
        selectButton.dataset.selectedCharacter = '';
    }
    
    // Add each character with completion status
    Object.entries(window.characterCreator.CHARACTERS).forEach(([id, char]) => {
        const charButton = document.createElement('button');
        charButton.className = 'character-option';
        charButton.dataset.character = id;
        
        // Create character preview container
        const previewContainer = document.createElement('div');
        previewContainer.className = 'character-preview';
        
        // Create mini character
        const miniCharacter = window.characterCreator.createPlayerCharacter(id, { x: 0, y: 0 });
        miniCharacter.style.position = 'relative';
        miniCharacter.style.transform = 'scale(0.8)';
        previewContainer.appendChild(miniCharacter);
        
        // Create name container
        const nameContainer = document.createElement('div');
        nameContainer.className = 'character-name';
        nameContainer.textContent = char.name;
        
        // Add completion indicator if character has succeeded
        if (gameState.completedCharacters.has(id)) {
            const checkmark = document.createElement('span');
            checkmark.className = 'completion-indicator';
            checkmark.textContent = ' ✓';
            checkmark.style.color = '#00ff00';
            checkmark.style.textShadow = '0 0 5px #00ff00';
            nameContainer.appendChild(checkmark);
            charButton.classList.add('completed');
        }
        
        // Add elements to button
        charButton.appendChild(previewContainer);
        charButton.appendChild(nameContainer);
        
        // Add click event
        charButton.addEventListener('click', () => selectCharacter(id));
        
        characterList.appendChild(charButton);
    });
}

// Add touch controls for mobile devices
function addTouchControls() {
    const touchControls = document.createElement('div');
    touchControls.id = 'touch-controls';
    touchControls.className = 'touch-controls';
    
    // Create directional buttons
    const directions = ['up', 'down', 'left', 'right'];
    directions.forEach(dir => {
        const button = document.createElement('button');
        button.className = `touch-button touch-${dir}`;
        button.innerHTML = `<span class="arrow-${dir}">⬆</span>`; // Will be rotated via CSS
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTouchMovement(dir);
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            const player = document.getElementById('player');
            if (player && typeof player.stopWalking === 'function') {
                player.stopWalking();
            }
        });
        touchControls.appendChild(button);
    });
    
    gameScene.appendChild(touchControls);
}

// Handle touch movement
function handleTouchMovement(direction) {
    if (gameState.phase !== 'exploration') return;
    
    const player = document.getElementById('player');
    if (!player) return;
    
    const speed = 10;
    let isMoving = false;
    
    switch(direction) {
        case 'left':
            gameState.playerPosition.x = Math.max(50, gameState.playerPosition.x - speed);
            player.style.transform = 'scaleX(-1)';
            isMoving = true;
            break;
        case 'right':
            gameState.playerPosition.x = Math.min(700, gameState.playerPosition.x + speed);
            player.style.transform = '';
            isMoving = true;
            break;
        case 'up':
            gameState.playerPosition.y = Math.min(400, gameState.playerPosition.y + speed);
            isMoving = true;
            break;
        case 'down':
            gameState.playerPosition.y = Math.max(150, gameState.playerPosition.y - speed);
            isMoving = true;
            break;
    }
    
    // Update position
    player.style.left = gameState.playerPosition.x + 'px';
    player.style.bottom = gameState.playerPosition.y + 'px';
    
    // Animate walking
    if (isMoving && player.getAttribute('data-walking') !== 'true') {
        player.startWalking();
    }
    
    // Check proximity to doorman and NPCs (reuse existing proximity check logic)
    const doorman = document.getElementById('doorman');
    if (doorman) {
        const doormanRect = doorman.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        
        if (
            Math.abs(playerRect.left - doormanRect.left) < 100 &&
            Math.abs(playerRect.top - doormanRect.top) < 100
        ) {
            interactWithDoorman();
        }
    }
} 