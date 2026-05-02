// ===== POWERED TEXT UPGRADE (SRABON) =====

const cx = rX + (rRight - rX) / 2;
const cy = blockY + blockH / 2;

ctx.save();
ctx.textAlign = 'center';

// ✨ Glow effect
ctx.shadowColor = 'rgba(0,200,255,0.6)';
ctx.shadowBlur = 18;

// 🎨 Gradient
const pGrad = ctx.createLinearGradient(cx - 180, 0, cx + 180, 0);
pGrad.addColorStop(0, '#00c6ff');
pGrad.addColorStop(0.5, '#00ffd5');
pGrad.addColorStop(1, '#00ff9c');

ctx.fillStyle = pGrad;

// 🔥 Font
ctx.font = 'bold 24px "Segoe UI", Arial';

// ✅ TEXT
ctx.fillText('Powered By Sʀᴀʙᴏɴ', cx, cy + 8);

ctx.restore();

// ===== SUB TEXT (OPTIONAL CLEAN LOOK) =====
ctx.save();
ctx.textAlign = 'center';
ctx.font = '500 13px Arial';
ctx.fillStyle = 'rgba(255,255,255,0.35)';
ctx.fillText('WELCOME SYSTEM • SRABON', cx, cy + 30);
ctx.restore();
