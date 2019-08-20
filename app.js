'use strict'
import Screen from "./engine/Screen.js";
import PixelManipulation from "./Pixel.js";
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = Math.random() * 5;
    }
    update(time = 1) {
        this.x += time * this.speed * Math.sin(directions[Math.floor(this.x) + width * Math.floor(this.y)]);
        this.y += time * this.speed * Math.cos(directions[Math.floor(this.x) + width * Math.floor(this.y)]);
        if(this.y < 0) this.y += height;
        else if(this.y >= height) this.y -= height;

        if(this.x < 0) this.x += width;
        else if(this.x >= width) this.x -= width;
    }
};

const get2D = (data, scalar = 1.4) => {
    const octaves = 8;
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let noise = 0;
            let scale = 1;
            let scaleAcc = 0;
            for(let octave = 0; octave < octaves; octave++){
                let pitch = width >> octave;

                let sampleX1 = Math.floor(x / pitch) * pitch;
                let sampleY1 = Math.floor(y / pitch) * pitch;

                let sampleX2 = (sampleX1 + pitch) % width;
                let sampleY2 = (sampleY1 + pitch) % height;

                const blendX = (x - sampleX1) / pitch;
                const blendY = (y - sampleY1) / pitch;

                const sampleT = (1 - blendX) * data[sampleX1 + width * sampleY1] + blendX * data[sampleX2 + width * sampleY1];
                const sampleB = (1 - blendX) * data[sampleX1 + width * sampleY2] + blendX * data[sampleX2 + width * sampleY2];

                noise += (blendY * (sampleB - sampleT) + sampleT) * scale;
                scaleAcc += scale;
                scale /= scalar;
            }
            directions[x + width * y] = noise / scaleAcc * 2 * Math.PI;
        }
    }
}

const doFirst = () => {
    for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) noise2D[i + width * j] = Math.random();        
    }
    setTimeout(() => doSecond(), 1500);
};

const doSecond = () => {
    get2D(noise2D);
    setTimeout(() => doFirst(), 1500);
};

const updateTime = () => {
    lastTime = currentTime;
    currentTime = Date.now();
};

const width = 600;
const height = 400;

const directions = new Array(width * height);
const screen = new Screen(width, height);
const noise2D = new Array(width * height);
const renderer = screen.context;
screen.setBackground("white");
const pixels = new PixelManipulation(screen.canvas);
const framerate = document.querySelector(".framerate");
let lastTime = 0;
let currentTime = Date.now();

for(let i = 0; i < width; i++) {
    for(let j = 0; j < height; j++) noise2D[i + width * j] = Math.random();
}
get2D(noise2D);

const particles = new Array(50000);
for(let i = 0; i < particles.length; i++) particles[i] = new Particle;

const overlay = document.createElement("canvas");
overlay.width = width;
overlay.height = height;
const overlayCtx = overlay.getContext("2d");
overlayCtx.fillStyle = "#FFFFFF05";
overlayCtx.fillRect(0, 0, width, height);
renderer.fillStyle = "red";

pixels.fillColor(255, 255, 255);
pixels.setImage();

const loop = () => {
    updateTime();
    renderer.drawImage(overlay, 0, 0);
    pixels.getImage();
    for(let i = 0; i < particles.length; i++) {
        particles[i].update();
        pixels.setRed(Math.floor(particles[i].x), Math.floor(particles[i].y));
    }
    pixels.setImage();
    framerate.innerHTML = Math.floor(1000 / (currentTime - lastTime));
    requestAnimationFrame(loop);
}

doFirst();
requestAnimationFrame(loop);