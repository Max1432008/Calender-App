const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const amount = 200;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;

    this.size = 2;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) {
      this.vx *= -1;
    }

    if (this.y < 0 || this.y > canvas.height) {
      this.vy *= -1;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(202, 36, 36, 0.08)";
    ctx.fill();
  }
}

for (let i = 0; i < amount; i++) {
  particles.push(new Particle());
}

function connect() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;

      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        let opacity = 1 - distance / 150;

        ctx.strokeStyle = `rgba(77,166,255,${opacity * 0.6})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.move();
    p.draw();
  });

  connect();

  requestAnimationFrame(animate);
}

animate();
