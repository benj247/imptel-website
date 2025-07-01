// Matrix Rain Animation - IMPTEL Computer Science Page

(function() {
    'use strict';
    
    // Configuration
    const config = {
        characters: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
        fontSize: 14,
        columnWidth: 20,
        speed: 50,
        fadeSpeed: 0.05,
        color: '#00FF41',
        intensity: 0.7 // Default intensity (70%)
    };
    
    // State
    let canvas, ctx;
    let columns = [];
    let animationId;
    let isRunning = false;
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', init);
    
    function init() {
        canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        
        // Set canvas size
        resizeCanvas();
        
        // Initialize columns
        initColumns();
        
        // Start animation
        start();
        
        // Event listeners
        window.addEventListener('resize', debounce(handleResize, 250));
        window.addEventListener('animationIntensityChanged', handleIntensityChange);
        
        // Visibility change handling
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    function initColumns() {
        const numberOfColumns = Math.floor(canvas.width / config.columnWidth);
        columns = [];
        
        for (let i = 0; i < numberOfColumns; i++) {
            columns.push({
                x: i * config.columnWidth,
                y: Math.random() * canvas.height,
                speed: 0.5 + Math.random() * 1.5,
                opacity: Math.random(),
                characters: generateCharacterStream()
            });
        }
    }
    
    function generateCharacterStream() {
        const streamLength = Math.floor(canvas.height / config.fontSize) + 10;
        let stream = '';
        
        for (let i = 0; i < streamLength; i++) {
            stream += config.characters.charAt(Math.floor(Math.random() * config.characters.length));
        }
        
        return stream;
    }
    
    function draw() {
        // Create trail effect
        ctx.fillStyle = `rgba(0, 0, 0, ${config.fadeSpeed})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set font
        ctx.font = `${config.fontSize}px monospace`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Draw columns
        columns.forEach(column => {
            // Calculate visible characters based on intensity
            const visibleChars = Math.floor(column.characters.length * config.intensity);
            
            for (let i = 0; i < visibleChars; i++) {
                const charY = column.y - (i * config.fontSize);
                
                if (charY > -config.fontSize && charY < canvas.height) {
                    // Calculate character opacity
                    let opacity = 1;
                    if (i === 0) {
                        opacity = 1; // Brightest at the head
                    } else {
                        opacity = Math.max(0, 1 - (i / visibleChars));
                    }
                    
                    // Apply intensity modifier
                    opacity *= config.intensity;
                    
                    // Set color with opacity
                    ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
                    
                    // Draw character
                    ctx.fillText(
                        column.characters[i],
                        column.x,
                        charY
                    );
                }
            }
            
            // Update column position
            column.y += column.speed * config.speed / 30;
            
            // Reset column when it goes off screen
            if (column.y - (visibleChars * config.fontSize) > canvas.height) {
                column.y = -config.fontSize;
                column.characters = generateCharacterStream();
                column.speed = 0.5 + Math.random() * 1.5;
            }
        });
        
        // Continue animation
        if (isRunning) {
            animationId = requestAnimationFrame(draw);
        }
    }
    
    function start() {
        if (!isRunning) {
            isRunning = true;
            draw();
        }
    }
    
    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function handleResize() {
        resizeCanvas();
        initColumns();
    }
    
    function handleIntensityChange(event) {
        config.intensity = event.detail.intensity;
    }
    
    function handleVisibilityChange() {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API
    window.matrixRain = {
        start: start,
        stop: stop,
        setIntensity: function(intensity) {
            config.intensity = Math.max(0, Math.min(1, intensity));
        },
        getIntensity: function() {
            return config.intensity;
        }
    };
})();