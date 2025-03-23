/**
 * Character styling and rendering for Get Into Rose game
 * This module handles the visual appearance of characters in the game
 */

// Character styling constants
const COLORS = {
    SKIN: '#f8d5a3',
    SKIN_SHADOW: '#e6b580',
    SKIN_TAN: '#d49d6a',
    SKIN_PALE: '#f1e2d0',
    HAIR_DARK: '#3a2b21',
    HAIR_BLONDE: '#e6c986',
    HAIR_RED: '#8b3d2b',
    HAIR_BLACK: '#0a0a0a',
    SHIRT_WHITE: '#ffffff',
    SHIRT_BLUE: '#3498db',
    SHIRT_RED: '#e74c3c',
    SHIRT_GREEN: '#2ecc71',
    SHIRT_PURPLE: '#9b59b6',
    SHIRT_YELLOW: '#f1c40f',
    SHIRT_SHADOW: '#e0e0e0',
    PANTS_DARK: '#2c2c2c',
    PANTS_BLUE: '#2980b9',
    PANTS_KHAKI: '#d4b48c',
    PANTS_SHADOW: '#1a1a1a',
    BELT_BROWN: '#8b4513',
    BELT_BLACK: '#0d0d0d',
    SHOES_DARK: '#1a1a1a'
};

// Character definitions
const CHARACTERS = {
    sebbe: {
        name: 'Sebbe',
        description: 'The chill regular who\'s practically family at Rose. The doorman loves him!',
        hairColor: COLORS.HAIR_DARK,
        skinColor: COLORS.SKIN,
        shirtColor: COLORS.SHIRT_WHITE,
        pantsColor: COLORS.PANTS_DARK,
        scale: 1.1,
        entryMethod: 'automatic',
        specialFeature: null // No special feature needed for Sebbe
    },
    mayo: {
        name: 'Mayo',
        description: 'The DJ that always tries to kiss the ladies at a epic drop',
        hairColor: COLORS.HAIR_BLONDE,
        skinColor: COLORS.SKIN_PALE,
        shirtColor: COLORS.SHIRT_BLUE,
        pantsColor: COLORS.PANTS_DARK,
        scale: 1.05,
        entryMethod: 'dancing',
        specialFeature: 'sunglasses' // Adding sunglasses
    },
    henke: {
        name: 'Henke',
        description: 'Strong party player, but can sometime disappear for a coke and a burger',
        hairColor: COLORS.HAIR_DARK,
        skinColor: COLORS.SKIN,
        shirtColor: COLORS.SHIRT_RED,
        pantsColor: COLORS.PANTS_BLUE,
        scale: 1.1,
        entryMethod: 'charm',
        specialFeature: 'styled_hair' // Styled hair
    },
    wugk: {
        name: 'Wugk',
        description: 'Longest guy at the club, perfect wingman when he has not been at a AW with his collegues',
        hairColor: COLORS.HAIR_BLACK,
        skinColor: COLORS.SKIN_PALE,
        shirtColor: COLORS.SHIRT_PURPLE,
        pantsColor: COLORS.PANTS_DARK,
        scale: 1.15,
        entryMethod: 'mystery',
        specialFeature: 'mask' // Adding a mask
    },
    venneman: {
        name: 'Venneman',
        description: 'Knows how to talk to people, but does he still have that skill since he hasn\'t been out since 2021',
        hairColor: COLORS.HAIR_DARK,
        skinColor: COLORS.SKIN,
        shirtColor: COLORS.SHIRT_WHITE,
        pantsColor: COLORS.PANTS_DARK,
        scale: 1.08,
        entryMethod: 'connections',
        specialFeature: 'suit' // Business suit
    },
    linkan: {
        name: 'Linkan',
        description: 'aka the stockmaster, can maybe sell the doorman some Immunivoastocks to get into the club',
        hairColor: COLORS.HAIR_RED,
        skinColor: COLORS.SKIN,
        shirtColor: COLORS.SHIRT_GREEN,
        pantsColor: COLORS.PANTS_KHAKI,
        scale: 1,
        entryMethod: 'creative',
        specialFeature: 'beret' // Artist beret
    },
    mans: {
        name: 'MÅNS',
        description: 'Smooth talker who can charm his way in. Always running late, but knows how to talk his way out of it.',
        hairColor: COLORS.HAIR_BLONDE,
        skinColor: COLORS.SKIN,
        shirtColor: COLORS.SHIRT_YELLOW,
        pantsColor: COLORS.PANTS_BLUE,
        scale: 1.05,
        entryMethod: 'music',
        specialFeature: 'headphones' // Headphones
    }
};

/**
 * Creates a styled character element with proper styling
 * @param {string} type - The type of character (player, doorman, npc)
 * @param {Object} options - Additional styling options
 * @returns {HTMLElement} - The styled character element
 */
function createStyledCharacter(type, options = {}) {
    // Default options
    const defaultOptions = {
        hairColor: COLORS.HAIR_DARK,
        skinColor: COLORS.SKIN,
        shirtColor: COLORS.SHIRT_WHITE,
        pantsColor: COLORS.PANTS_DARK,
        scale: 1,
        facingDirection: 'right',
        specialFeature: null
    };
    
    // Merge default options with provided options
    const settings = { ...defaultOptions, ...options };
    
    // Create main character container
    const character = document.createElement('div');
    character.className = `character ${type}-character`;
    character.style.position = 'absolute';
    character.style.width = `${80 * settings.scale}px`;
    character.style.height = `${150 * settings.scale}px`;
    character.style.zIndex = type === 'player' ? 10 : 5;
    character.style.transform = settings.facingDirection === 'left' ? 'scaleX(-1)' : '';
    
    // Create character parts - using divs with detailed styling
    // Head
    const head = document.createElement('div');
    head.className = 'character-head';
    head.style.position = 'absolute';
    head.style.width = `${35 * settings.scale}px`;
    head.style.height = `${40 * settings.scale}px`;
    head.style.backgroundColor = settings.skinColor;
    head.style.borderRadius = `${15 * settings.scale}px ${15 * settings.scale}px ${10 * settings.scale}px ${10 * settings.scale}px`;
    head.style.top = `${10 * settings.scale}px`;
    head.style.left = `${22 * settings.scale}px`;
    head.style.boxShadow = `inset -3px 3px 0 ${COLORS.SKIN_SHADOW}`;
    
    // Hair
    const hair = document.createElement('div');
    hair.className = 'character-hair';
    hair.style.position = 'absolute';
    hair.style.width = `${40 * settings.scale}px`;
    hair.style.height = `${20 * settings.scale}px`;
    hair.style.backgroundColor = settings.hairColor;
    hair.style.borderRadius = `${10 * settings.scale}px ${10 * settings.scale}px 0 0`;
    hair.style.top = `${5 * settings.scale}px`;
    hair.style.left = `${20 * settings.scale}px`;
    
    // Customize hair if needed
    if (settings.specialFeature === 'styled_hair') {
        hair.style.height = `${25 * settings.scale}px`;
        hair.style.width = `${44 * settings.scale}px`;
        hair.style.borderRadius = `${12 * settings.scale}px ${12 * settings.scale}px 0 0`;
        hair.style.left = `${18 * settings.scale}px`;
    }
    
    // Eyes
    const eyes = document.createElement('div');
    eyes.className = 'character-eyes';
    eyes.style.position = 'absolute';
    eyes.style.width = `${20 * settings.scale}px`;
    eyes.style.height = `${6 * settings.scale}px`;
    eyes.style.top = `${22 * settings.scale}px`;
    eyes.style.left = `${30 * settings.scale}px`;
    
    // Left eye
    const leftEye = document.createElement('div');
    leftEye.style.position = 'absolute';
    leftEye.style.width = `${6 * settings.scale}px`;
    leftEye.style.height = `${6 * settings.scale}px`;
    leftEye.style.backgroundColor = '#000';
    leftEye.style.borderRadius = '50%';
    leftEye.style.left = '0';
    
    // Right eye
    const rightEye = document.createElement('div');
    rightEye.style.position = 'absolute';
    rightEye.style.width = `${6 * settings.scale}px`;
    rightEye.style.height = `${6 * settings.scale}px`;
    rightEye.style.backgroundColor = '#000';
    rightEye.style.borderRadius = '50%';
    rightEye.style.right = '0';
    
    // Add eyes to the eyes container
    eyes.appendChild(leftEye);
    eyes.appendChild(rightEye);
    
    // Mouth 
    const mouth = document.createElement('div');
    mouth.className = 'character-mouth';
    mouth.style.position = 'absolute';
    mouth.style.width = `${10 * settings.scale}px`;
    mouth.style.height = `${3 * settings.scale}px`;
    mouth.style.backgroundColor = '#c0392b';
    mouth.style.top = `${36 * settings.scale}px`;
    mouth.style.left = `${33 * settings.scale}px`;
    mouth.style.borderRadius = `${2 * settings.scale}px`;
    
    // Body/Torso - shirt
    const torso = document.createElement('div');
    torso.className = 'character-torso';
    torso.style.position = 'absolute';
    torso.style.width = `${45 * settings.scale}px`;
    torso.style.height = `${50 * settings.scale}px`;
    torso.style.backgroundColor = settings.shirtColor;
    torso.style.boxShadow = `inset -4px 0 0 ${COLORS.SHIRT_SHADOW}`;
    torso.style.top = `${50 * settings.scale}px`;
    torso.style.left = `${17 * settings.scale}px`;
    torso.style.borderRadius = `${5 * settings.scale}px`;
    
    // Special case for suit
    if (settings.specialFeature === 'suit') {
        torso.style.backgroundColor = '#222';
        torso.style.height = `${55 * settings.scale}px`;
        
        // Add tie
        const tie = document.createElement('div');
        tie.style.position = 'absolute';
        tie.style.width = `${8 * settings.scale}px`;
        tie.style.height = `${30 * settings.scale}px`;
        tie.style.backgroundColor = '#e74c3c';
        tie.style.top = `${5 * settings.scale}px`;
        tie.style.left = `${19 * settings.scale}px`;
        tie.style.zIndex = '1';
        
        torso.appendChild(tie);
    }
    
    // Arms - create sleeve effect
    const leftArm = document.createElement('div');
    leftArm.className = 'character-arm';
    leftArm.style.position = 'absolute';
    leftArm.style.width = `${12 * settings.scale}px`;
    leftArm.style.height = `${40 * settings.scale}px`;
    leftArm.style.backgroundColor = settings.shirtColor;
    leftArm.style.boxShadow = `inset -2px 0 0 ${COLORS.SHIRT_SHADOW}`;
    leftArm.style.top = `${55 * settings.scale}px`;
    leftArm.style.left = `${10 * settings.scale}px`;
    leftArm.style.borderRadius = `${5 * settings.scale}px`;
    leftArm.style.transformOrigin = 'top center';
    
    const rightArm = document.createElement('div');
    rightArm.className = 'character-arm';
    rightArm.style.position = 'absolute';
    rightArm.style.width = `${12 * settings.scale}px`;
    rightArm.style.height = `${40 * settings.scale}px`;
    rightArm.style.backgroundColor = settings.shirtColor;
    rightArm.style.boxShadow = `inset -2px 0 0 ${COLORS.SHIRT_SHADOW}`;
    rightArm.style.top = `${55 * settings.scale}px`;
    rightArm.style.right = `${10 * settings.scale}px`;
    rightArm.style.borderRadius = `${5 * settings.scale}px`;
    rightArm.style.transformOrigin = 'top center';
    
    // If it's a suit, update arm colors too
    if (settings.specialFeature === 'suit') {
        leftArm.style.backgroundColor = '#222';
        rightArm.style.backgroundColor = '#222';
    }
    
    // Belt
    const belt = document.createElement('div');
    belt.className = 'character-belt';
    belt.style.position = 'absolute';
    belt.style.width = `${45 * settings.scale}px`;
    belt.style.height = `${5 * settings.scale}px`;
    belt.style.backgroundColor = COLORS.BELT_BROWN;
    belt.style.top = `${100 * settings.scale}px`;
    belt.style.left = `${17 * settings.scale}px`;
    
    // Legs
    const leftLeg = document.createElement('div');
    leftLeg.className = 'character-leg';
    leftLeg.style.position = 'absolute';
    leftLeg.style.width = `${15 * settings.scale}px`;
    leftLeg.style.height = `${45 * settings.scale}px`;
    leftLeg.style.backgroundColor = settings.pantsColor;
    leftLeg.style.boxShadow = `inset -2px 0 0 ${COLORS.PANTS_SHADOW}`;
    leftLeg.style.top = `${105 * settings.scale}px`;
    leftLeg.style.left = `${25 * settings.scale}px`;
    
    const rightLeg = document.createElement('div');
    rightLeg.className = 'character-leg';
    rightLeg.style.position = 'absolute';
    rightLeg.style.width = `${15 * settings.scale}px`;
    rightLeg.style.height = `${45 * settings.scale}px`;
    rightLeg.style.backgroundColor = settings.pantsColor;
    rightLeg.style.boxShadow = `inset -2px 0 0 ${COLORS.PANTS_SHADOW}`;
    rightLeg.style.top = `${105 * settings.scale}px`;
    rightLeg.style.left = `${42 * settings.scale}px`;
    
    // Feet/Shoes
    const leftFoot = document.createElement('div');
    leftFoot.className = 'character-foot';
    leftFoot.style.position = 'absolute';
    leftFoot.style.width = `${18 * settings.scale}px`;
    leftFoot.style.height = `${8 * settings.scale}px`;
    leftFoot.style.backgroundColor = COLORS.SHOES_DARK;
    leftFoot.style.borderRadius = `${3 * settings.scale}px`;
    leftFoot.style.top = `${150 * settings.scale}px`;
    leftFoot.style.left = `${24 * settings.scale}px`;
    
    const rightFoot = document.createElement('div');
    rightFoot.className = 'character-foot';
    rightFoot.style.position = 'absolute';
    rightFoot.style.width = `${18 * settings.scale}px`;
    rightFoot.style.height = `${8 * settings.scale}px`;
    rightFoot.style.backgroundColor = COLORS.SHOES_DARK;
    rightFoot.style.borderRadius = `${3 * settings.scale}px`;
    rightFoot.style.top = `${150 * settings.scale}px`;
    rightFoot.style.left = `${41 * settings.scale}px`;
    
    // Add all parts to the character
    character.appendChild(leftFoot);
    character.appendChild(rightFoot);
    character.appendChild(leftLeg);
    character.appendChild(rightLeg);
    character.appendChild(torso);
    character.appendChild(belt);
    character.appendChild(leftArm);
    character.appendChild(rightArm);
    character.appendChild(head);
    character.appendChild(hair);
    character.appendChild(eyes);
    character.appendChild(mouth);
    
    // Add special features
    if (settings.specialFeature) {
        switch(settings.specialFeature) {
            case 'sunglasses':
                const sunglasses = document.createElement('div');
                sunglasses.style.position = 'absolute';
                sunglasses.style.width = `${30 * settings.scale}px`;
                sunglasses.style.height = `${8 * settings.scale}px`;
                sunglasses.style.backgroundColor = '#000';
                sunglasses.style.top = `${22 * settings.scale}px`;
                sunglasses.style.left = `${25 * settings.scale}px`;
                sunglasses.style.zIndex = '2'; // Above eyes
                character.appendChild(sunglasses);
                break;
                
            case 'mask':
                const mask = document.createElement('div');
                mask.style.position = 'absolute';
                mask.style.width = `${35 * settings.scale}px`;
                mask.style.height = `${15 * settings.scale}px`;
                mask.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                mask.style.top = `${20 * settings.scale}px`;
                mask.style.left = `${22 * settings.scale}px`;
                mask.style.borderRadius = `${10 * settings.scale}px`;
                mask.style.zIndex = '2'; // Above eyes
                character.appendChild(mask);
                
                // Adjust eyes to be visible over mask
                leftEye.style.backgroundColor = '#fff';
                rightEye.style.backgroundColor = '#fff';
                break;
                
            case 'beret':
                const beret = document.createElement('div');
                beret.style.position = 'absolute';
                beret.style.width = `${30 * settings.scale}px`;
                beret.style.height = `${10 * settings.scale}px`;
                beret.style.backgroundColor = '#e74c3c'; // Red beret
                beret.style.borderRadius = '50%';
                beret.style.top = `${2 * settings.scale}px`;
                beret.style.left = `${25 * settings.scale}px`;
                beret.style.zIndex = '2'; // Above hair
                character.appendChild(beret);
                break;
                
            case 'headphones':
                const headphones = document.createElement('div');
                headphones.style.position = 'absolute';
                headphones.style.width = `${40 * settings.scale}px`;
                headphones.style.height = `${15 * settings.scale}px`;
                headphones.style.borderRadius = '50%';
                headphones.style.border = `${3 * settings.scale}px solid #2c3e50`;
                headphones.style.borderBottom = 'none';
                headphones.style.top = `${8 * settings.scale}px`;
                headphones.style.left = `${20 * settings.scale}px`;
                headphones.style.zIndex = '2'; // Above hair
                character.appendChild(headphones);
                break;
        }
    }
    
    // Add any custom styles based on character type
    if (type === 'doorman') {
        // Make doorman bigger and more intimidating
        character.style.transform = `scale(1.3)`;
        head.style.backgroundColor = '#d49d6a'; // Different skin tone
        torso.style.backgroundColor = '#333'; // Black shirt
        leftArm.style.backgroundColor = '#333';
        rightArm.style.backgroundColor = '#333';
        
        // Add sunglasses
        const sunglasses = document.createElement('div');
        sunglasses.style.position = 'absolute';
        sunglasses.style.width = `${30 * settings.scale}px`;
        sunglasses.style.height = `${8 * settings.scale}px`;
        sunglasses.style.backgroundColor = '#000';
        sunglasses.style.top = `${22 * settings.scale}px`;
        sunglasses.style.left = `${25 * settings.scale}px`;
        character.appendChild(sunglasses);
        
        // Add a beard
        const beard = document.createElement('div');
        beard.style.position = 'absolute';
        beard.style.width = `${20 * settings.scale}px`;
        beard.style.height = `${10 * settings.scale}px`;
        beard.style.backgroundColor = '#000';
        beard.style.borderRadius = `${5 * settings.scale}px`;
        beard.style.top = `${33 * settings.scale}px`;
        beard.style.left = `${30 * settings.scale}px`;
        character.appendChild(beard);
    }
    
    return character;
}

/**
 * Creates a character selection option
 * @param {string} characterId - The ID of the character
 * @returns {HTMLElement} - The character option element for selection screen
 */
function createCharacterOption(characterId) {
    const character = CHARACTERS[characterId];
    if (!character) return null;
    
    const option = document.createElement('div');
    option.className = 'character-option';
    option.dataset.character = characterId;
    
    // Character preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'character-preview';
    
    // Create mini character
    const miniCharacter = createStyledCharacter('preview', {
        hairColor: character.hairColor,
        skinColor: character.skinColor,
        shirtColor: character.shirtColor,
        pantsColor: character.pantsColor,
        scale: 0.5,
        specialFeature: character.specialFeature
    });
    
    // Remove absolute positioning for the mini character
    miniCharacter.style.position = 'relative';
    miniCharacter.style.left = 'auto';
    miniCharacter.style.bottom = 'auto';
    miniCharacter.style.transform = 'scale(0.8)';
    
    previewContainer.appendChild(miniCharacter);
    
    // Character name
    const name = document.createElement('div');
    name.className = 'character-name';
    name.textContent = character.name;
    
    // Add to option
    option.appendChild(previewContainer);
    option.appendChild(name);
    
    // Add click event
    option.addEventListener('click', () => {
        // Remove selected class from all options
        document.querySelectorAll('.character-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to this option
        option.classList.add('selected');
        
        // Update description
        const descriptionElement = document.getElementById('character-description');
        if (descriptionElement) {
            descriptionElement.textContent = character.description;
        }
        
        // Enable select button
        const selectButton = document.getElementById('select-character-button');
        if (selectButton) {
            selectButton.disabled = false;
            selectButton.dataset.selectedCharacter = characterId;
        }
    });
    
    return option;
}

/**
 * Creates the player character with the specified character's appearance
 * @param {string} characterId - The ID of the character to create
 * @param {Object} position - The initial position of the character
 * @returns {HTMLElement} - The player character element
 */
function createPlayerCharacter(characterId, position) {
    const character = CHARACTERS[characterId] || CHARACTERS.sebbe; // Default to Sebbe if not found
    
    const player = createStyledCharacter('player', {
        hairColor: character.hairColor,
        skinColor: character.skinColor,
        shirtColor: character.shirtColor,
        pantsColor: character.pantsColor,
        scale: character.scale,
        specialFeature: character.specialFeature
    });
    
    player.id = 'player';
    player.style.left = position.x + 'px';
    player.style.bottom = position.y + 'px';
    
    // Add walking animation
    player.setAttribute('data-walking', 'false');
    
    return player;
}

/**
 * Creates the doorman character
 * @returns {HTMLElement} - The doorman element
 */
function createDoormanCharacter() {
    const doorman = createStyledCharacter('doorman', {
        scale: 1.2,
        skinColor: '#d49d6a', // Slightly different skin tone
        shirtColor: '#333'    // Black shirt
    });
    
    doorman.id = 'doorman';
    doorman.style.bottom = '150px';
    doorman.style.right = '300px';  // Moved further left (increased from 200px)
    
    return doorman;
}

/**
 * Creates an NPC character
 * @param {string} type - The type of NPC (regular, conspiracyNut, failedDJ)
 * @param {Object} position - The position of the NPC
 * @returns {HTMLElement} - The NPC element
 */
function createNPCCharacter(type, position) {
    let npcOptions = {
        scale: 1
    };
    
    // Customize NPC appearance based on type
    switch(type) {
        case 'blondeGirl':
            npcOptions = {
                scale: 0.9,
                hairColor: COLORS.HAIR_BLONDE,
                skinColor: COLORS.SKIN_PALE,
                shirtColor: COLORS.SHIRT_PURPLE,
                pantsColor: COLORS.PANTS_DARK,
                specialFeature: 'long_hair'
            };
            break;
        // ... existing NPC types ...
    }
    
    const npc = createStyledCharacter(type, npcOptions);
    
    // Add facial features for blonde girl
    if (type === 'blondeGirl') {
        // Add eyes with makeup
        const eyes = document.createElement('div');
        eyes.className = 'character-eyes';
        eyes.style.position = 'absolute';
        eyes.style.top = `${22 * npcOptions.scale}px`;
        eyes.style.left = `${22 * npcOptions.scale}px`;
        eyes.style.width = `${20 * npcOptions.scale}px`;
        eyes.style.height = `${6 * npcOptions.scale}px`;
        eyes.style.display = 'flex';
        eyes.style.justifyContent = 'space-between';
        
        // Left eye with makeup
        const leftEye = document.createElement('div');
        leftEye.style.width = `${6 * npcOptions.scale}px`;
        leftEye.style.height = `${6 * npcOptions.scale}px`;
        leftEye.style.backgroundColor = '#000';
        leftEye.style.borderRadius = '50%';
        leftEye.style.boxShadow = `0 ${2 * npcOptions.scale}px ${3 * npcOptions.scale}px #ff69b4`; // Pink eyeshadow
        
        // Right eye with makeup
        const rightEye = document.createElement('div');
        rightEye.style.width = `${6 * npcOptions.scale}px`;
        rightEye.style.height = `${6 * npcOptions.scale}px`;
        rightEye.style.backgroundColor = '#000';
        rightEye.style.borderRadius = '50%';
        rightEye.style.boxShadow = `0 ${2 * npcOptions.scale}px ${3 * npcOptions.scale}px #ff69b4`; // Pink eyeshadow
        
        eyes.appendChild(leftEye);
        eyes.appendChild(rightEye);
        npc.appendChild(eyes);
        
        // Add smile
        const smile = document.createElement('div');
        smile.className = 'character-mouth';
        smile.style.position = 'absolute';
        smile.style.top = `${32 * npcOptions.scale}px`;
        smile.style.left = `${27 * npcOptions.scale}px`;
        smile.style.width = `${12 * npcOptions.scale}px`;
        smile.style.height = `${6 * npcOptions.scale}px`;
        smile.style.borderBottom = `${2 * npcOptions.scale}px solid #ff69b4`; // Pink lipstick
        smile.style.borderRadius = `0 0 ${8 * npcOptions.scale}px ${8 * npcOptions.scale}px`;
        npc.appendChild(smile);
        
        // Add long hair with style
        const longHair = document.createElement('div');
        longHair.className = 'character-long-hair';
        longHair.style.position = 'absolute';
        longHair.style.width = `${35 * npcOptions.scale}px`;
        longHair.style.height = `${60 * npcOptions.scale}px`;
        longHair.style.backgroundColor = COLORS.HAIR_BLONDE;
        longHair.style.borderRadius = `${10 * npcOptions.scale}px`;
        longHair.style.top = `${20 * npcOptions.scale}px`;
        longHair.style.left = `${22 * npcOptions.scale}px`;
        longHair.style.zIndex = '1';
        // Add hair highlights
        longHair.style.backgroundImage = `linear-gradient(45deg, ${COLORS.HAIR_BLONDE}, #fff8dc, ${COLORS.HAIR_BLONDE})`;
        npc.appendChild(longHair);
    }
    
    npc.className = 'npc ' + type;
    npc.style.left = position.left;
    npc.style.bottom = position.bottom;
    npc.dataset.npcId = type;
    
    return npc;
}

/**
 * Populates the character selection screen with all available characters
 */
function populateCharacterSelect() {
    const characterList = document.getElementById('character-list');
    if (!characterList) return;
    
    // Clear existing content
    characterList.innerHTML = '';
    
    // Add character options
    for (const characterId in CHARACTERS) {
        const option = createCharacterOption(characterId);
        if (option) {
            characterList.appendChild(option);
        }
    }
}

// Export the character creation functions
window.characterCreator = {
    createPlayerCharacter,
    createDoormanCharacter,
    createNPCCharacter,
    populateCharacterSelect,
    CHARACTERS
}; 