// Circuit Path Electrons Enhanced - 50+ electrons with path pooling, center glow, and pulsing effects
(function() {
    'use strict';
    
    const config = {
        electronColor: '#00ffff',
        electronGlow: '#00ffff',
        electronSize: 4,
        electronSpeed: 0.002, // Progress per millisecond
        minSpawnDelay: 200, // Minimum delay between spawns
        maxSpawnDelay: 1000, // Maximum delay between spawns
        tailLength: 0.2, // 20% of path
        glowRadius: 12,
        pathIds: ['p1', 'p2', 'p3', 'p4'], // Specific path IDs to animate (using inkscape:label)
        includePathsAbove: 335, // Include all paths with id="pathXXX" where XXX > 335
        maxPathId: 495, // Maximum path ID to include
        baseElectronCount: 50, // Base number of electrons at 0.5 intensity
        maxElectronCount: 70, // Maximum electrons at 1.0 intensity
        svgFile: 'assets/images/circuitpaths.svg',
        centerCircleId: 'path4', // ID of center circle in circuit-lines.svg
        centerGlowDuration: 2000, // Glow duration in ms (increased for continuous effect)
        centerGlowDecay: 10 // Slower decay rate for glow intensity
    };
    
    let container;
    let canvas;
    let ctx;
    let availablePaths = []; // Pool of paths without electrons
    let activePaths = {}; // Map of pathId -> electron
    let electrons = [];
    let animationId;
    let speedMultiplier = 0.5; // Default speed at 0.5 intensity
    let targetElectronCount = config.baseElectronCount;
    let lastSpawnTime = 0;
    let nextSpawnDelay = 500;
    
    // Center glow state
    let centerGlowIntensity = 0;
    let centerGlowTimer = 0;
    let centerCircleElement = null;
    let centerPulsePhase = 0; // For pulsating effect
    
    class PathElectron {
        constructor(pathId, pathData) {
            this.pathId = pathId;
            this.pathData = pathData;
            this.progress = 0;
            this.alive = true;
            this.trail = [];
            this.maxTrailPoints = 30;
            
            // Create a temporary path element for measurements
            this.tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            this.tempPath.setAttribute('d', this.pathData);
            document.body.appendChild(this.tempPath);
            this.pathLength = this.tempPath.getTotalLength();
        }
        
        update(deltaTime) {
            this.progress += config.electronSpeed * speedMultiplier * deltaTime;
            
            if (this.progress >= 1) {
                this.alive = false;
                // Trigger center glow
                onElectronComplete();
                return false;
            }
            
            // Get current position on path
            try {
                const distance = this.progress * this.pathLength;
                const point = this.tempPath.getPointAtLength(distance);
                
                // Add to trail
                this.trail.push({ x: point.x, y: point.y });
                if (this.trail.length > this.maxTrailPoints) {
                    this.trail.shift();
                }
            } catch (e) {
                console.error('Error updating electron:', e);
                this.alive = false;
                return false;
            }
            
            return true;
        }
        
        draw(ctx, transform) {
            if (this.trail.length < 2) return;
            
            // Draw trail with gradient
            ctx.strokeStyle = config.electronGlow;
            ctx.lineCap = 'round';
            
            for (let i = 1; i < this.trail.length; i++) {
                const alpha = (i / this.trail.length) * 0.6;
                const width = (i / this.trail.length) * config.electronSize * 2;
                
                // Apply transform to coordinates
                const prev = transform(this.trail[i - 1]);
                const curr = transform(this.trail[i]);
                
                ctx.globalAlpha = alpha;
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(curr.x, curr.y);
                ctx.stroke();
            }
            
            // Draw electron head
            const head = transform(this.trail[this.trail.length - 1]);
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = config.glowRadius;
            ctx.shadowColor = config.electronGlow;
            ctx.fillStyle = config.electronColor;
            ctx.beginPath();
            ctx.arc(head.x, head.y, config.electronSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Extra glow
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(head.x, head.y, config.electronSize * 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
        
        destroy() {
            if (this.tempPath && this.tempPath.parentNode) {
                this.tempPath.parentNode.removeChild(this.tempPath);
            }
        }
    }
    
    function init() {
        console.log('Initializing circuit path electron test animation...');
        
        container = document.querySelector('.circuits-container');
        if (!container) {
            console.error('Circuit container not found');
            return;
        }
        
        // Create canvas overlay
        canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        container.appendChild(canvas);
        ctx = canvas.getContext('2d');
        
        // Load the SVG paths
        loadSVGPaths();
        
        // Find center circle element
        findCenterCircle();
    }
    
    function findCenterCircle() {
        // Try to find the center circle in the background SVG
        const bgImage = container.querySelector('img');
        if (bgImage && bgImage.src.includes('circuit-lines.svg')) {
            // For now, we'll draw the glow on our canvas
            // In a real implementation, we might load the SVG and find the actual element
            console.log('Center circle glow will be rendered on canvas');
        }
    }
    
    function loadSVGPaths() {
        fetch(config.svgFile)
            .then(response => response.text())
            .then(svgText => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                
                // Find all valid paths
                const allPaths = svgDoc.querySelectorAll('path');
                const pathDataMap = {};
                
                allPaths.forEach(pathElement => {
                    const label = pathElement.getAttribute('inkscape:label');
                    const id = pathElement.getAttribute('id');
                    let pathIdentifier = null;
                    
                    // Check if it has a label we're looking for
                    if (label && config.pathIds.includes(label)) {
                        pathIdentifier = label;
                    }
                    // Check if it has an ID > 335 and <= 495
                    else if (id && id.startsWith('path')) {
                        const pathNumber = parseInt(id.replace('path', ''));
                        if (!isNaN(pathNumber) && pathNumber > config.includePathsAbove && pathNumber <= config.maxPathId) {
                            pathIdentifier = id;
                        }
                    }
                    
                    if (pathIdentifier) {
                        const d = pathElement.getAttribute('d');
                        if (d) {
                            pathDataMap[pathIdentifier] = d;
                            availablePaths.push(pathIdentifier);
                        }
                    }
                });
                
                // Store path data globally
                window.pathDataMap = pathDataMap;
                
                if (availablePaths.length > 0) {
                    console.log(`Loaded ${availablePaths.length} paths for animation`);
                    
                    // Shuffle available paths for random distribution
                    shuffleArray(availablePaths);
                    
                    // Get SVG viewBox for coordinate transformation
                    const svgElement = svgDoc.querySelector('svg');
                    const viewBox = svgElement.getAttribute('viewBox');
                    if (viewBox) {
                        const [x, y, width, height] = viewBox.split(' ').map(Number);
                        window.svgViewBox = { x, y, width, height };
                    }
                    
                    // Setup and start animation
                    resizeCanvas();
                    window.addEventListener('resize', resizeCanvas);
                    setupControls();
                    animate();
                } else {
                    console.error('No valid paths found in SVG');
                }
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
            });
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    function setupControls() {
        const slider = document.getElementById('animation-intensity');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                
                if (value < 0.5) {
                    // Below 0.5: slower speed, 50 electrons
                    speedMultiplier = 0.25 + value * 0.5; // 0.25 to 0.5
                    targetElectronCount = config.baseElectronCount;
                } else {
                    // Above 0.5: faster speed, 50-70 electrons
                    speedMultiplier = 0.5 + (value - 0.5); // 0.5 to 1.0
                    targetElectronCount = Math.round(config.baseElectronCount + 
                        (config.maxElectronCount - config.baseElectronCount) * ((value - 0.5) * 2));
                }
                
                console.log(`Intensity: ${value}, Speed: ${speedMultiplier}x, Target electrons: ${targetElectronCount}`);
            });
            
            // Set initial value to 0.5
            slider.value = 0.5;
        }
    }
    
    function spawnElectron(currentTime) {
        // Check if we need more electrons
        const electronDeficit = targetElectronCount - electrons.length;
        if (electronDeficit <= 0) return;
        
        // If we have available paths, spawn electrons
        if (availablePaths.length === 0) return;
        
        // Determine how many to spawn this frame based on deficit
        let spawnCount;
        if (electronDeficit > 10) {
            spawnCount = Math.min(5, electronDeficit); // Spawn up to 5 when far below
        } else if (electronDeficit > 5) {
            spawnCount = Math.min(3, electronDeficit); // Spawn up to 3 when moderately below
        } else if (electronDeficit > 1) {
            spawnCount = Math.min(2, electronDeficit); // Spawn up to 2 when slightly below
        } else {
            // Only 1 electron needed - check delay for smooth spawning
            if (currentTime - lastSpawnTime < nextSpawnDelay) return;
            spawnCount = 1;
        }
        
        // Spawn the electrons
        for (let i = 0; i < spawnCount && availablePaths.length > 0; i++) {
            const pathId = availablePaths.shift();
            const pathData = window.pathDataMap[pathId];
            
            if (pathData) {
                const electron = new PathElectron(pathId, pathData);
                electrons.push(electron);
                activePaths[pathId] = electron;
            }
        }
        
        // Update spawn timing
        if (spawnCount > 0) {
            lastSpawnTime = currentTime;
            // Only set delay if we're close to target (for smooth final spawning)
            if (electronDeficit <= 1) {
                nextSpawnDelay = config.minSpawnDelay + 
                    Math.random() * (config.maxSpawnDelay - config.minSpawnDelay);
            }
        }
    }
    
    function onElectronComplete() {
        // Increase center glow intensity more gradually
        centerGlowIntensity = Math.min(centerGlowIntensity + 0.1, 1.0);
        // Reset timer to keep glow alive
        centerGlowTimer = config.centerGlowDuration;
    }
    
    function drawCenterGlow(ctx, transform, deltaTime) {
        if (centerGlowIntensity <= 0) return;
        
        // Update pulse phase - speed based on speedMultiplier (faster at max)
        centerPulsePhase += deltaTime * 0.006 * speedMultiplier * speedMultiplier; // Exponential scaling for more dramatic speed difference
        
        // Calculate pulsing multiplier (oscillates between 0.7 and 1.0 for better visibility)
        const pulseMultiplier = 0.7 + 0.3 * Math.sin(centerPulsePhase);
        
        // Assume center is at SVG coordinates (1333.3334, 1333.3334) based on viewBox center
        const center = transform({ x: 1333.3334, y: 1333.3334 });
        
        ctx.save();
        
        // Apply pulsing to the glow effect
        const effectiveIntensity = centerGlowIntensity * pulseMultiplier;
        
        ctx.globalAlpha = effectiveIntensity;
        ctx.shadowBlur = 50 * effectiveIntensity;
        ctx.shadowColor = config.electronGlow;
        ctx.fillStyle = config.electronGlow;
        
        // Draw multiple concentric circles for enhanced glow effect with pulsing radii
        const numCircles = 6; // More circles for better definition
        for (let i = 0; i < numCircles; i++) {
            ctx.globalAlpha = effectiveIntensity * (0.7 - i * 0.1);
            const baseRadius = 30 + i * 20;
            const pulsingRadius = baseRadius + (15 * pulseMultiplier * (1 - i/numCircles)); // Outer circles pulse less
            ctx.beginPath();
            ctx.arc(center.x, center.y, pulsingRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add multiple bright cores for more definition
        ctx.shadowBlur = 30;
        
        // Inner bright ring
        ctx.globalAlpha = effectiveIntensity * 0.6;
        ctx.lineWidth = 3 + 2 * pulseMultiplier;
        ctx.strokeStyle = config.electronGlow;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 40 + 10 * pulseMultiplier, 0, Math.PI * 2);
        ctx.stroke();
        
        // Middle bright ring
        ctx.globalAlpha = effectiveIntensity * 0.4;
        ctx.lineWidth = 2 + pulseMultiplier;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 60 + 15 * pulseMultiplier, 0, Math.PI * 2);
        ctx.stroke();
        
        // Central bright core that pulses
        ctx.globalAlpha = effectiveIntensity * 0.9;
        ctx.fillStyle = config.electronGlow;
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 15 + 5 * pulseMultiplier, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    function animate(currentTime) {
        currentTime = currentTime || 0;
        const deltaTime = 16; // 60fps
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create coordinate transformation function (matching object-fit: cover)
        const svgViewBox = window.svgViewBox || { x: 0, y: 0, width: 2666.6667, height: 2666.6667 };
        const scale = Math.max(canvas.width / svgViewBox.width, canvas.height / svgViewBox.height);
        const offsetX = (canvas.width - svgViewBox.width * scale) / 2;
        const offsetY = (canvas.height - svgViewBox.height * scale) / 2;
        
        // Transform function that matches the background image scaling
        const transform = (point) => ({
            x: point.x * scale + offsetX,
            y: point.y * scale + offsetY
        });
        
        // Update center glow
        if (centerGlowTimer > 0) {
            centerGlowTimer -= deltaTime;
            if (centerGlowTimer <= 0) {
                centerGlowIntensity = Math.max(0, centerGlowIntensity - config.centerGlowDecay / 1000 * deltaTime);
            }
        } else if (centerGlowIntensity > 0) {
            centerGlowIntensity = Math.max(0, centerGlowIntensity - config.centerGlowDecay / 1000 * deltaTime);
            if (centerGlowIntensity === 0) {
                centerPulsePhase = 0; // Reset pulse phase when glow fades out
            }
        }
        
        // Draw center glow first (behind electrons)
        drawCenterGlow(ctx, transform, deltaTime);
        
        
        // Spawn new electrons if needed
        spawnElectron(currentTime);
        
        // Update and draw electrons
        electrons = electrons.filter(electron => {
            const alive = electron.update(deltaTime);
            if (alive) {
                electron.draw(ctx, transform);
            } else {
                // Return path to available pool
                availablePaths.push(electron.pathId);
                delete activePaths[electron.pathId];
                electron.destroy();
            }
            return alive;
        });
        
        // Remove excess electrons if target count decreased
        while (electrons.length > targetElectronCount && electrons.length > 0) {
            const electron = electrons.pop();
            availablePaths.push(electron.pathId);
            delete activePaths[electron.pathId];
            electron.destroy();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Handle visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!document.hidden && canvas) {
            animate();
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        electrons.forEach(e => e.destroy());
    });
})();