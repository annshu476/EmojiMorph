const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//this canva is invisible
const offCanvas = document.createElement("canvas");
offCanvas.width = canvas.width;
offCanvas.height = canvas.height;
const offCtx = offCanvas.getContext("2d");

const emojis = ["😀", "😐", "😡", "🔥", "💀"];

const totalDuration = 4000; // 4 seconds
let startTime = null;

function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMorphSequence(progress);

    if (progress < 1) {
        requestAnimationFrame(animate);
    }
}

function drawMaskedEmoji(emoji, revealProgress) {
    offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);

    const centerX = offCanvas.width / 2;
    const centerY = offCanvas.height / 2;

    // Draw emoji normally on offscreen canvas
    offCtx.font = `100px serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText(emoji, centerX, centerY);

    // Apply mask
    offCtx.globalCompositeOperation = "destination-in";
    offCtx.fillRect(
        0,
        offCanvas.height * (1 - revealProgress),
        offCanvas.width,
        offCanvas.height * revealProgress
    );

    offCtx.globalCompositeOperation = "source-over";

    // Draw masked result onto main canvas
    ctx.drawImage(offCanvas, 0, 0);
}

function drawMorphSequence(progress) {
    const count = emojis.length;
    const segment = 1 / (count - 1);

    const index = Math.min(
        Math.floor(progress / segment),
        count - 2
    );

    const raw = (progress - index * segment) / segment;

    const HOLD_END = 0.3;
    const FADE_END = 0.75;

    const currentEmoji = emojis[index];
    const nextEmoji = emojis[index + 1];

    // ---- HOLD PHASE ----
    if (raw <= HOLD_END) {
        drawEmoji(
            currentEmoji,
            canvas.width / 2,
            canvas.height / 2,
            1,
            1
        );
        return;
    }

    // ---- MORPH PHASE ----
    const t = Math.min((raw - HOLD_END) / (FADE_END - HOLD_END), 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Old emoji shrinks away (no mask)
    if (t < 1) {
        drawEmoji(
            currentEmoji,
            canvas.width / 2,
            canvas.height / 2,
            1 - t * 0.05,
            1 - t
        );
    }

    // New emoji reveals progressively (MASKED)
    drawMaskedEmoji(nextEmoji, t);
}




function drawEmoji(emoji, x, y, scale, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `${100 * scale}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, x, y);
    ctx.restore();
}


requestAnimationFrame(animate);
