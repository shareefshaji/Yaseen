const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const list = document.getElementById("list");
const searchBox = document.getElementById("searchBox");
const bar = document.getElementById("bar");
const now = document.getElementById("now");
const duasBtn = document.getElementById("duasBtn");
const player = document.getElementById("player");
const closeDuaBtn = document.getElementById("closeDuaBtn");

document.body.classList.add("locked");

const API = "https://api.alquran.cloud/v1/surah/36/ar.alafasy";
const bismillahAudio = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";

let ayahs = [];
let index = 0;
let audio = new Audio();
let isAuto = false;

/* ================= LOAD ================= */
fetch(API)
.then(res => res.json())
.then(data => {
    ayahs = data.data.ayahs;
    render(ayahs);
});

/* ================= RENDER ================= */
function render(data){

    list.innerHTML = "";

    data.forEach((a) => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <div class="arabic">${a.text}</div>
            <div class="eng">۞ ${a.numberInSurah}</div>
        `;

        const realIndex = ayahs.findIndex(x => x.number === a.number);
        div.onclick = () => play(realIndex);

        list.appendChild(div);
    });
}

/* ================= PLAY ================= */
playBtn.onclick = () => {

    if (!ayahs || ayahs.length === 0) return;

    isAuto = true;
    audio._bismillahPlayed = false;
    play(0);
};

function play(i){

    if (!ayahs[i]) return;

    player.classList.remove("hidden");

    index = i;

    document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));

    if(document.querySelectorAll(".card")[i]){
        document.querySelectorAll(".card")[i].classList.add("active");
        document.querySelectorAll(".card")[i].scrollIntoView({behavior:"smooth", block:"center"});
    }

    // Bismillah only once
    if(i === 0 && !audio._bismillahPlayed){
        audio.src = bismillahAudio;
        audio._bismillahPlayed = true;

        audio.play();

        audio.onended = () => playAyah(0);
        return;
    }

    playAyah(i);
}

/* ================= AYAH ================= */
function playAyah(i){

    const ayah = ayahs[i];
    if (!ayah) return;

    audio.src = ayah.audio;
    audio.play();

    now.textContent = "Ayah " + ayah.numberInSurah;

    audio.onended = () => {
        if (isAuto && ayahs[i + 1]) {
            play(i + 1);
        } else {
            showDua();
        }
    };
}

/* ================= CONTROLS ================= */
nextBtn.onclick = () => play(index + 1);
prevBtn.onclick = () => play(index - 1);

/* ================= PROGRESS ================= */
audio.ontimeupdate = () => {
    if (audio.duration) {
        bar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    }
};

/* ================= SEARCH ================= */
searchBox.oninput = () => {

    const v = searchBox.value.toLowerCase();

    const filtered = ayahs.filter(a =>
        a.text.toLowerCase().includes(v) ||
        String(a.numberInSurah).includes(v)
    );

    render(filtered);
};

/* ================= DUAS ================= */
const yaseenDua = {
    ar: `
اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ

اللَّهُمَّ اجْعَلْ ثَوَابَ مَا قَرَأْنَاهُ رَحْمَةً وَمَغْفِرَةً

مِنَّا إِلَى أَرْوَاحِ أَمْوَاتِنَا

اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ

رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً
وَفِي الآخِرَةِ حَسَنَةً
وَقِنَا عَذَابَ النَّارِ
`,
    en: `
Allahumma salli ‘ala Muhammad wa aali Muhammad.

Allahumma aj‘al thawaba ma qara’nahu rahmatan wa maghfirah.

Minna ila arwaahi amwatina.

Allahummaghfir lahum warhamhum.

Rabbana atina fid-dunya hasanah
wa fil-akhirati hasanah
wa qina ‘adhaban-nar.
`
};

/* ================= DUAS OPEN ================= */
duasBtn.onclick = () => {

    list.innerHTML = `
        <div class="card">
            <div class="arabic">${yaseenDua.ar}</div>
            <div class="eng">${yaseenDua.en}</div>
        </div>
    `;

    now.textContent = "📿 Yaseen Dua";

    player.classList.add("hidden");
    closeDuaBtn.style.display = "block";
};

/* ================= CLOSE DUAS ================= */
if (closeDuaBtn) {
    closeDuaBtn.onclick = () => {
        closeDuaBtn.style.display = "none";
        render(ayahs);
        now.textContent = "📖 Quran";
        player.classList.remove("hidden");
    };
}

/* ================= SPLASH ================= */
const msgBox = document.getElementById("msg");

const messages = [
    "🕌 Allah is Great",
    "📖 Read Quran Daily",
    "🤲 Remember Allah",
    "🌙 Peace from Salah",
    "🕋 Stay patient",
    "📿 Dhikr brings peace",
    "✨ Ease after hardship",
    "🕌 Bismillah first"
];

function showRandomMsg(){
    msgBox.innerText = messages[Math.floor(Math.random()*messages.length)];
}

const interval = setInterval(showRandomMsg, 1000);

setTimeout(() => {

    clearInterval(interval);

    const splash = document.getElementById("splash");

    if (splash) {
        splash.style.opacity = "0";
        setTimeout(() => splash.remove(), 500);
    }

    document.body.classList.remove("locked");

}, 5000);