const $ = (selector) => document.querySelector(selector);

const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalContent = $("#modalContent");
const modalSymbol = $("#modalSymbol");
const modalEyebrow = $("#modalEyebrow");
const toast = $("#toast");
const audio = $("#backgroundMusic");
const musicButton = $("#musicButton");
const musicLabel = $("#musicLabel");

const messages = {
  letter: {
    symbol: "💌",
    eyebrow: "A LETTER FROM MY HEART",
    title: "رسالة مخصوص ليكي يا بسملة",
    content: "يا بسملة،\nيمكن الكلام ساعات ميكفيش عشان يوصف مكانتك، بس حبيت أعملك حاجة تفضّل تفكّرك إنك غالية عندي.\nأتمنى أيامك كلها تبقى شبه ضحكتك: جميلة، خفيفة، ومليانة نور.\nبحبك يا بسملة ❤️"
  },
  reasons: {
    symbol: "♡",
    eyebrow: "TEN LITTLE THINGS",
    title: "أسباب بتخلّيكي مميزة",
    content: `<div class="reason-list">
      <div>01 — ضحكتك اللي بتفرّح قلبي.</div>
      <div>02 — طيبة قلبك.</div>
      <div>03 — طريقتك الحلوة في الكلام.</div>
      <div>04 — اهتمامك بالتفاصيل.</div>
      <div>05 — روحك الجميلة.</div>
      <div>06 — عفويتك اللي بحبها.</div>
      <div>07 — وجودك اللي بيهوّن اليوم.</div>
      <div>08 — إنك بتخلّي اللحظات العادية مميزة.</div>
      <div>09 — إنك على طبيعتك.</div>
      <div>10 — ببساطة… عشان إنتِ بسملة ❤️</div>
    </div>`
  },
  gift: {
    symbol: "🎁",
    eyebrow: "A LITTLE SURPRISE",
    title: "افتحي هديتك",
    content: `<div class="gift-box">🎀</div><p>هديتي ليكي مش في علبة… هديتي إنّي أتمنى أشوفك مبسوطة، وتفضلي دايمًا شايفة قد إيه إنتِ غالية.</p><p style="color:#ff9bc7;font-weight:800">بحبك يا بسملة ❤️</p>`
  }
};

function openModal(data) {
  modalSymbol.textContent = data.symbol;
  modalEyebrow.textContent = data.eyebrow;
  modalTitle.textContent = data.title;
  modalContent.innerHTML = data.content;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  $("#closeModal").focus();
}
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}
$("#openLetter").addEventListener("click", () => openModal(messages.letter));
document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", () => openModal(messages[button.dataset.open]));
});
$("#closeModal").addEventListener("click", closeModal);
$("#modalDone").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

$("#meowButton").addEventListener("click", () => {
  showToast("مياااو 🐱 القطة بتقولك: بحبك يا بسملة!");
  burstHearts(12);
});

$("#sendHearts").addEventListener("click", () => {
  burstHearts(32);
  showToast("كل القلوب دي طايرة ليكي يا بسملة ❤️");
});

function burstHearts(amount = 15) {
  const symbols = ["♥", "♡", "✦", "🌸"];
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-float";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${15 + Math.random() * 23}px`;
    heart.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
  }
}

musicButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicButton.classList.add("playing");
      musicLabel.textContent = "الموسيقى تعمل";
    } catch {
      showToast("ضيف ملف music.mp3 داخل مجلد المشروع الأول 🎵");
    }
  } else {
    audio.pause();
    musicButton.classList.remove("playing");
    musicLabel.textContent = "موسيقى هادئة";
  }
});

// Subtle floating particles in the background
const canvas = $("#particles");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, dots = [];
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  dots = Array.from({length: Math.min(65, Math.floor(width / 14))}, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.7 + .4,
    v: Math.random() * .22 + .06,
    a: Math.random() * .5 + .15
  }));
}
function animate() {
  ctx.clearRect(0, 0, width, height);
  dots.forEach(dot => {
    dot.y -= dot.v;
    if (dot.y < -5) { dot.y = height + 5; dot.x = Math.random() * width; }
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 171, 207, ${dot.a})`;
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);


// Little interactive kitten: every tap brings a new affectionate message.
const catLines = [
  "مياااو! يا بسملة، إنتِ قمر ❤️",
  "أنا القطة الحارسة لضحكتك… ممنوع الزعل! 🐾",
  "عارفة؟ في حد عامل العالم ده كله عشانك 💗",
  "خدي حضن قططي كبيررررر! 🐱",
  "تم اكتشاف أجمل بنوتة في العالم: بسملة! ✨",
  "وصلتي 100% حب… بس أنا حبي ليكي مالوش آخر! 💞"
];
let catTaps = 0;
const petCat = $("#petCat");
const catSpeech = $("#catSpeech");
const loveFill = $("#loveFill");
const lovePercent = $("#lovePercent");
function updateCatLove() {
  catTaps++;
  const progress = Math.min(catTaps * 20, 100);
  loveFill.style.width = `${progress}%`;
  lovePercent.textContent = `${progress}%`;
  catSpeech.textContent = catLines[Math.min(catTaps - 1, catLines.length - 1)];
  petCat.classList.remove("purring");
  void petCat.offsetWidth;
  petCat.classList.add("purring");
  burstHearts(catTaps >= 5 ? 22 : 5);
  if (catTaps === 5) {
    setTimeout(() => openModal({
      symbol: "🐾💌",
      eyebrow: "SECRET UNLOCKED",
      title: "مفاجأة القطة لبسملة",
      content: "أنا قطة صغيرة، بس عندي سر كبير… في قلب بيحبك جدًا، وصاحب القلب ده بيتمنى يشوفك مبسوطة كل يوم.

بحبك يا بسملة ❤️"
    }), 450);
  }
}
petCat.addEventListener("click", updateCatLove);
$("#catTreat").addEventListener("click", () => {
  catSpeech.textContent = "ياااه وردة ليا؟ هديكي بدلها مليون قلب! 🌹💗";
  burstHearts(24);
  showToast("القطة فرحت بالوردة جدًا! 🐱🌹");
});
