
function main() {
  // console.log("main");
  const stars = document.getElementById("stars");

  const width = stars.width = window.innerWidth;
  const height = stars.height = window.innerHeight;

  let orrery = new Orrery(stars, width, height);
}

class Orrery {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.background = 'rgb(253, 131, 117)';

    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height

    // solid background
    // this.ctx.fillStyle = 'rgb(253, 131, 117)';
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < 4096; i++) {
      this.renderStar(Math.random() * this.width, Math.random() * this.height, Math.random() * .8);
    }
  }

  renderStar = function (ra, dec, lum) {
    this.ctx.fillStyle = `rgb(255,255,255)`;
    this.ctx.globalAlpha = lum;
    this.ctx.beginPath();
    this.ctx.arc(ra, dec, 3.2, 0, 2 * Math.PI, false);
    this.ctx.fill();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});