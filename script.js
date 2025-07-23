
let level = 1;
let player = { x: 200, y: 400, hp: 5, damage: 1, coins: 0 };
let bullets = [];
let enemies = [];
let bosses = {5: "Big Virus", 10: "Toxic Germ", 15: "Mutated Syringe", 20: "Evil Doctor", 25: "Ultra Virus", 30: "King Bacteria"};

function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    loadLevel(level);
}

function openUpgrades() { alert("שדרוגים בקרוב: נזק, מהירות ירי, חיים!"); }
function openLevels() { alert("בחירת שלב בקרוב. הושלם עד שלב 30!"); }
function resetProgress() {
    localStorage.clear();
    alert("התקדמות אופסה!");
}

function loadLevel(n) {
    alert("שלב " + n + (bosses[n] ? " - בוס: " + bosses[n] : ""));
    bullets = [];
    enemies = [{ x: Math.random() * 400, y: 0, hp: n < 5 ? 1 : 3 }];
    if (bosses[n]) {
        enemies.push({ x: 150, y: 50, hp: 10 + n, boss: true });
    }
}

function shoot() {
    bullets.push({ x: player.x + 20, y: player.y, speed: -5 });
}

function update() {
    bullets.forEach(b => b.y += b.speed);
    enemies.forEach(e => {
        e.y += e.boss ? 0.3 : 1;
        bullets.forEach(b => {
            if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20) {
                e.hp -= player.damage;
                b.hit = true;
            }
        });
    });
    enemies = enemies.filter(e => e.hp > 0 && e.y < 500);
    bullets = bullets.filter(b => !b.hit && b.y > 0);
    if (enemies.length === 0) {
        player.coins += 10;
        level++;
        saveProgress();
        loadLevel(level);
    }
    draw();
}

function saveProgress() {
    localStorage.setItem("crazy_doctor_save", JSON.stringify({ level, player }));
}

function draw() {
    let ctx = document.getElementById("gameCanvas").getContext("2d");
    ctx.clearRect(0, 0, 400, 500);
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, 40, 40);
    ctx.fillStyle = "green";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 5, 10));
    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.boss ? 60 : 30, e.boss ? 60 : 30));
}

window.onload = () => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    let saved = localStorage.getItem("crazy_doctor_save");
    if (saved) {
        let data = JSON.parse(saved);
        level = data.level;
        player = data.player;
    }
    setInterval(update, 50);
};

window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") player.x -= 10;
    if (e.key === "ArrowRight") player.x += 10;
    if (e.key === " ") shoot();
});
