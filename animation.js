const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Emoji sequence (later this comes from user input)
const emojis = ["😀", "😎", "🔥", "💀"];

// Animation settings
const totalDuration = 3000; // 3 seconds
const framesPerSecond = 60;

let startTime = null;

// Core animation loop
function animate(timestamp) {
    //progress start from 0 
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;

    // Normalize progress (0 → 1)
    const progress = Math.min(elapsed / totalDuration, 1);

    drawFrame(progress);

    if (progress < 1) {
        requestAnimationFrame(animate);
    }
}

// Draw one frame
function drawFrame(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const emojiCount = emojis.length;
    const segment = 1 / emojiCount;

    for (let i = 0; i < emojiCount; i++) {
        const start = i * segment;
        const end = start + segment;

        if (progress >= start && progress <= end) {
            const localProgress = (progress - start) / segment;
            drawEmoji(emojis[i], localProgress);
            break;
        }
    }
}

// Draw a single emoji with animation
function drawEmoji(emoji, progress) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Scale + fade animation
    const scale = 0.5 + progress * 0.5;
    const opacity = progress;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `${100 * scale}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, centerX, centerY);
    ctx.restore();
}

// Start animation
requestAnimationFrame(animate);
