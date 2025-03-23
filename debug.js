/**
 * Debug utilities for the Get Into Rose game
 */

// Initialize debug mode
const DEBUG = true;

// Custom console logger that shows output on screen and in browser console
function initDebugConsole() {
    if (!DEBUG) return;
    
    const consoleLog = document.getElementById('console-log');
    const debugConsole = document.getElementById('debug-console');
    
    if (!consoleLog || !debugConsole) return;
    
    debugConsole.classList.remove('hidden');
    debugConsole.style.position = 'fixed';
    debugConsole.style.bottom = '0';
    debugConsole.style.left = '0';
    debugConsole.style.width = '300px';
    debugConsole.style.maxHeight = '200px';
    debugConsole.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    debugConsole.style.color = '#fff';
    debugConsole.style.padding = '10px';
    debugConsole.style.fontSize = '12px';
    debugConsole.style.overflow = 'auto';
    debugConsole.style.zIndex = '9999';
    
    // Override console.log
    const originalLog = console.log;
    console.log = function() {
        originalLog.apply(console, arguments);
        
        const args = Array.from(arguments);
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return arg;
        }).join(' ');
        
        const logEntry = document.createElement('div');
        logEntry.textContent = `> ${message}`;
        consoleLog.appendChild(logEntry);
        
        // Auto-scroll to bottom
        debugConsole.scrollTop = debugConsole.scrollHeight;
    };
    
    // Override console.error
    const originalError = console.error;
    console.error = function() {
        originalError.apply(console, arguments);
        
        const args = Array.from(arguments);
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }
            return arg;
        }).join(' ');
        
        const logEntry = document.createElement('div');
        logEntry.textContent = `ERROR: ${message}`;
        logEntry.style.color = '#ff0000';
        consoleLog.appendChild(logEntry);
        
        // Auto-scroll to bottom
        debugConsole.scrollTop = debugConsole.scrollHeight;
    };
    
    console.log('Debug console initialized');
}

// Check game state and report issues
function checkGameState() {
    if (!DEBUG) return;
    
    console.log('Checking game state...');
    
    // Check if important DOM elements exist
    const elements = [
        'game-container',
        'game-scene',
        'dialogue-box',
        'menu-screen',
        'game-over-screen',
        'start-button',
        'restart-button'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Missing element: ${id}`);
        } else {
            const isVisible = !element.classList.contains('hidden') && 
                             window.getComputedStyle(element).display !== 'none';
            console.log(`Element ${id} exists and is ${isVisible ? 'visible' : 'hidden'}`);
        }
    });
    
    // Check for event listeners
    const startButton = document.getElementById('start-button');
    if (startButton) {
        console.log('Start button has click listener: ' + (startButton.onclick !== null || '_hasClickListener'));
    }
    
    console.log('Game state check complete');
}

// Initialize debug tools
document.addEventListener('DOMContentLoaded', function() {
    if (!DEBUG) return;
    
    // Add debug console to DOM if it doesn't exist
    if (!document.getElementById('debug-console')) {
        const debugConsole = document.createElement('div');
        debugConsole.id = 'debug-console';
        
        const consoleLog = document.createElement('pre');
        consoleLog.id = 'console-log';
        
        debugConsole.appendChild(consoleLog);
        document.body.appendChild(debugConsole);
    }
    
    initDebugConsole();
    
    // Manually check game state after a slight delay to ensure everything is loaded
    setTimeout(checkGameState, 500);
    
    // Add keyboard shortcut to check game state
    document.addEventListener('keydown', function(e) {
        // Press D to debug
        if (e.key === 'd' && e.ctrlKey) {
            checkGameState();
        }
    });
});

// Export debug functions
window.debugTools = {
    checkGameState,
    initDebugConsole
}; 