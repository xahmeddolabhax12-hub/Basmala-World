
/* =====================================
   BASMALA'S WORLD
   Main JavaScript
===================================== */

const $ = (selector) => document.querySelector(selector);

// Main elements
const welcomeScreen = $("#welcomeScreen");
const world = $("#world");
const enterWorld = $("#enterWorld");

const modal = $("#modal");
const closeModal = $("#closeModal");
const modalSymbol = $("#modalSymbol");
const modalEyebrow = $("#modalEyebrow");
const modalTitle = $("#modalTitle");
const modalText = $("#modalText");
const modalExtra = $("#modalExtra");
const modalAction = $("#modalAction");

const music = $("#backgroundMusic");
const soundBtn = $("#soundBtn");

let discovered = new Set();
let currentPlace = null;
let quizAnswered = false;

/* =====================================
   ENTER THE WORLD
===================================== */

enterWorld.addEventListener("click", () => {
    welcomeScreen.classList.add("exit");
    world.classList.remove("hidden");

    createSparkles(25);

    setTimeout(() => {
        welcomeScreen.style.display = "none";
    }, 1100);

    // محاولة تشغيل الصوت بعد تفاعل الزائرة
    music.play().then(() => {
        soundBtn.textContent = "♫ إيقاف الصوت";
    }).catch(() => {
        soundBtn.textContent = "♫ تشغيل الصوت";
    });
});

/* =====================================
   BACKGROUND MUSIC
===================================== */

soundBtn.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
            soundBtn.textContent = "♫ إيقاف الصوت";
        } catch (error) {
            soundBtn.textContent = "تعذر تشغيل الصوت";
        }
    } else {
        music.pause();
        soundBtn.textContent = "♫ تشغيل الصوت";
    }
});

/* =====================================
   MODAL SYSTEM
===================================== */

function openModal({
    symbol = "♡",
    eyebrow = "A SECRET FOR YOU",
    title = "رسالة ليكي",
    message = "",
    extra = "",
    button = "كمّلي رحلتكِ ♥"
}) {
    modalSymbol.textContent = symbol;
    modalEyebrow.textContent = eyebrow;
    modalTitle.textContent = title;
    modalText.textContent = message;
    modalExtra.innerHTML = extra;
    modalAction.textContent = button;

    modal.classList.add("show");
}

function hideModal() {
    modal.classList.remove("show");
}

closeModal.addEventListener("click", hideModal);
modalAction.addEventListener("click", hideModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideModal();
    }
});

/* =====================================
   WORLD LOCATIONS
===================================== */

const places = {
    castle: {
        symbol: "🏰",
        title: "قلعة الأمنيات",
        eyebrow: "THE CASTLE OF DREAMS",
        message:
            "في مكان بعيد عن زحمة الدنيا، فيه قلعة صغيرة اتبنت مخصوص علشانك.\n\nكل أوضة فيها أمنية، وكل شباك بيطل على حلم جميل.\n\nوأجمل أمنية في القلعة دي إنك تفضلي مبسوطة.",
        extra: "يا أميرة عالمي... ليكي مكان هنا دايمًا 👑"
    },

    garden: {
        symbol: "🌸",
        title: "حديقة الورود",
        eyebrow: "THE GARDEN OF LOVE",
        message:
            "كل وردة في الحديقة دي ليها معنى.\n\nوردة للضحكة اللي بتحلي يومي، ووردة لطيبة قلبك، ووردة لكل لحظة حلوة.\n\nولو كان ينفع أزرع الدنيا كلها ورد، كنت زرعتها علشانك.",
        extra: "وردة واحدة مش كفاية لجمالك 🌷"
    },

    stars: {
        symbol: "🌌",
        title: "بحر النجوم",
        eyebrow: "A SKY FULL OF WISHES",
        message:
            "بصي لفوق... كل نجمة هنا بتمثل أمنية.\n\nأتمنى ليكي أيام جميلة، وراحة لقلبك، وضحكة متغيبش عن وشك.\n\nوأتمنى أكون جزء من كل أحلامك الحلوة.",
        extra: "اختاري أمنية وخليها في قلبك ✨"
    },

    gift: {
        symbol: "🎁",
        title: "هدية مخصوص ليكي",
        eyebrow: "A SPECIAL SURPRISE",
        message:
            "يمكن الهدية دي مش غالية بالفلوس، بس جواها حاجة أغلى.\n\n10 أسباب تخليني أحبك كل يوم أكتر.",
        extra: `
            <div class="gift-reasons">
                <p>01 — ضحكتك اللي بتنور الدنيا.</p>
                <p>02 — طيبة قلبك.</p>
                <p>03 — طريقتك في الكلام.</p>
                <p>04 — اهتمامك بالتفاصيل.</p>
                <p>05 — وجودك في حياتي.</p>
                <p>06 — روحك الجميلة.</p>
                <p>07 — عيونك اللي بحبها.</p>
                <p>08 — عفويتك.</p>
                <p>09 — إنك إنتِ، من غير أي تغيير.</p>
                <p>10 — لأنك بسملة ❤️</p>
            </div>
        `
    },

    heart: {
        symbol: "💗",
        title: "جزيرة القلب",
        eyebrow: "THE HEART ISLAND",
        message:
            "في العالم ده أماكن كتير، بس المكان ده مختلف.\n\nده المكان اللي مفيهوش غير حاجة واحدة: مشاعر حقيقية.\n\nمهما كان العالم كبير، أتمنى تحسي دايمًا إن ليكي مكان آمن ومليان حب.",
        extra: "من قلبي لقلبك... بحبك يا بسملة ❤️"
    }
};

/* =====================================
   OPEN LOCATIONS
===================================== */

document.querySelectorAll("[data-place]").forEach((button) => {
    button.addEventListener("click", () => {
        const place = button.dataset.place;

        if (place === "quiz") {
            openQuiz();
            return;
        }

        if (!places[place]) return;

        currentPlace = place;

        discovered.add(place);
        updateDiscovery();

        const data = places[place];

        openModal({
            symbol: data.symbol,
            title: data.title,
            eyebrow: data.eyebrow,
            message: data.message,
            extra: data.extra,
            button: "ارجعي لاستكشاف العالم ♥"
        });

        createSparkles(18);
    });
});

/* =====================================
   DISCOVERY PROGRESS
===================================== */

function updateDiscovery() {
    const count = discovered.size;

    $("#discoveredCount").textContent = count;
    $("#progressFill").style.width = (count / 5 * 100) + "%";

    if (count === 5) {
        setTimeout(() => {
            openModal({
                symbol: "🏆",
                eyebrow: "MISSION COMPLETED",
                title: "اكتشفتي عالمك كله!",
                message:
                    "وصلتي لكل الأماكن السرية.\n\nكل مكان كان فيه جزء صغير من الحكاية، وإنتِ جمعتي كل الأجزاء.\n\nبس أجمل حاجة في العالم ده لسه هي وجودك فيه.",
                extra: "إنتِ نجمة العالم ده كلها يا بسملة ✨",
                button: "شكرًا على الرحلة ❤️"
            });
        }, 400);
    }
}

/* =====================================
   MINI LOVE GAME
===================================== */

function openQuiz() {
    if (quizAnswered) {
        openModal({
            symbol: "💗",
            title: "بطلة اللعبة!",
            message:
                "إنتِ عرفتي الإجابة من أول مرة.\n\nعارفة ليه؟ لأن الإجابة واضحة جدًا...",
            extra: "أجمل بنت في الدنيا هي بسملة ❤️"
        });
        return;
    }

    openModal({
        symbol: "✨",
        eyebrow: "A QUESTION FROM MY HEART",
        title: "مين أجمل بنت في الدنيا؟",
        message: "اختاري إجابتك يا أميرة العالم.",
        extra: `
            <div class="quiz-options">
                <button class="quiz-option" data-answer="wrong">
                    أميرة من عالم الخيال
                </button>
                <button class="quiz-option" data-answer="correct">
                    بسملة طبعًا ❤️
                </button>
                <button class="quiz-option" data-answer="wrong">
                    مفيش حد
                </button>
            </div>
        `,
        button: "إغلاق اللعبة"
    });
}

/* =====================================
   QUIZ ANSWERS
===================================== */

modalExtra.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-answer]");

    if (!answer) return;

    if (answer.dataset.answer === "correct") {
        quizAnswered = true;

        createSparkles(40);

        openModal({
            symbol: "👑",
            eyebrow: "CORRECT ANSWER!",
            title: "إجابة صحيحة يا بسملة!",
            message:
                "أهو شفتي؟ كنت متأكد إنك هتعرفي.\n\nمفيش حد يقدر ينافسك على مكانك في العالم ده.",
            extra: "الفائزة بلقب أميرة العالم: بسملة ❤️",
            button: "كمّلي الاستكشاف"
        });

    } else {
        answer.textContent = "فكري تاني يا أميرة ❤️";
        answer.style.borderColor = "#ff9ecf";
    }
});

/* =====================================
   DAYS COUNTER
===================================== */

const startDate = new Date(2026, 10, 13);

function updateDays() {
    const today = new Date();

    const difference = Math.max(
        0,
        Math.floor((today - startDate) / 86400000)
    );

    $("#daysCount").textContent = difference;
}

updateDays();
setInterval(updateDays, 60000);

/* =====================================
   MAGIC SPARKLES
===================================== */

function createSparkles(amount = 15) {
    for (let i = 0; i < amount; i++) {
        const sparkle = document.createElement("span");

        sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";
        sparkle.style.position = "fixed";
        sparkle.style.zIndex = "40";
        sparkle.style.pointerEvents = "none";
        sparkle.style.left = Math.random() * 100 + "vw";
        sparkle.style.top = Math.random() * 100 + "vh";
        sparkle.style.color = Math.random() > 0.5 ? "#ffc5e8" : "#c4adff";
        sparkle.style.fontSize = (10 + Math.random() * 20) + "px";
        sparkle.style.textShadow = "0 0 15px #e9a8e9";

        document.body.appendChild(sparkle);

        sparkle.animate([
            {
                opacity: 0,
                transform: "scale(0) rotate(0deg)"
            },
            {
                opacity: 1,
                transform: "scale(1.5) rotate(90deg)"
            },
            {
                opacity: 0,
                transform: "scale(0) rotate(180deg)"
            }
        ], {
            duration: 1400 + Math.random() * 1000,
            easing: "ease-out"
        });

        setTimeout(() => sparkle.remove(), 2500);
    }
}

/* =====================================
   ANIMATED STAR UNIVERSE
===================================== */

const canvas = $("#universe");
const ctx = canvas.getContext("2d");

let stars = [];
let width = 0;
let height = 0;

function resizeUniverse() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    stars = Array.from({
        length: Math.min(150, Math.floor(width * height / 6500))
    }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + .3,
        opacity: Math.random(),
        speed: Math.random() * .012 + .002,
        phase: Math.random() * Math.PI * 2
    }));
}

function drawUniverse(time = 0) {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
        const alpha = .25 + .65 *
            (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255, 222, 250, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#d9a5ed";
        ctx.fill();
    });

    ctx.shadowBlur = 0;

    requestAnimationFrame(drawUniverse);
}

window.addEventListener("resize", resizeUniverse);

resizeUniverse();
requestAnimationFrame(drawUniverse);

/* =====================================
   WELCOME SPARKLES
===================================== */

setInterval(() => {
    if (!welcomeScreen.classList.contains("exit")) {
        createSparkles(2);
    }
}, 1800);

console.log("Basmala's World is ready ❤️");
