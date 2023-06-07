const CAN_W = 300;
const CAN_H = 300;
const CAN_BG = "#000";

const GRAPH_W = 10;
// scale per pixel
const SPP = GRAPH_W / CAN_W;

const can = document.getElementById("canvas");
const ctx = can.getContext("2d");
can.width = CAN_W;
can.height = CAN_H;
can.style.background = CAN_BG;

let mouseX;
let mouseY;

can.addEventListener("mousemove", e => {
    const rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

const coefficient = [1, 3, 1, 0];
let TMPcoefficient = coefficient.slice();
const equation = (arr, x) => {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result += arr[i] * (x ** (arr.length - 1 - i));
    }
    return result;
};

const differential = (arr) => {
    const result = [];
    for (let i = 0; i < arr.length - 1; i++) {
        result[i] = arr[i] * (arr.length - 1 - i);
    }
    return result;
};

const drawLine = (x1, y1, x2, y2, c, w) => {
    ctx.beginPath();
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.stroke();
};

let points = [];

const makeGraphPoints = (arr) => {
    points = [];
    for (let x = -CAN_W / 2; x < CAN_W / 2; x++) {
        const p1x = x * SPP;
        const p1y = -equation(arr, p1x);
        const p2x = x + CAN_W / 2;
        const p2y = p1y / SPP + CAN_H / 2;
        points.push({ x: p2x, y: p2y });
    }
};

const drawGraph = () => {
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        // console.log(p1);
        drawLine(p1.x, p1.y, p2.x, p2.y, "white", 2);
    }
};

makeGraphPoints(coefficient);

const drawSlope = (slope) => {
    const x = (mouseX - CAN_W / 2) * SPP;
    const y = equation(coefficient, x);
    const a = slope;
    // y = ax + b
    const b = y - a * x;
    const x1 = ((GRAPH_W / 2 - b) / a + GRAPH_W / 2) / SPP;
    const x2 = ((-GRAPH_W / 2 - b) / a + GRAPH_W / 2) / SPP;

    drawLine(x1, 0, x2, CAN_H, "red", 3);
};

const drawLattice = () => {
    drawLine(0, CAN_H / 2, CAN_W, CAN_H / 2, "white", 1);
    drawLine(CAN_W / 2, 0, CAN_W / 2, CAN_H, "white", 1);
}

const cfs = document.getElementById("coefficients");
const makeRanges = () => {
    for (let i = coefficient.length - 1; i >= 0; i--) {
        const child = document.createElement("input");
        child.type = "range";
        child.id = `cfs${i}`;
        child.classList.add("range");
        child.list = "markers"
        child.value = coefficient[i];
        child.min = -10;
        child.max = 10;
        child.step = 0.2;
        cfs.prepend(child);
    }
}
makeRanges();

const importCfs = () => {
    for (let i = 0; i < coefficient.length; i++) {
        const range = document.getElementById(`cfs${i}`);
        coefficient[i] = range.value;
    }
}

const mainLoop = () => {
    ctx.clearRect(0, 0, CAN_W, CAN_H);
    importCfs();
    drawLattice();
    if (coefficient !== TMPcoefficient) {
        makeGraphPoints(coefficient);
    }
    drawGraph();
    const slope = equation(differential(coefficient), (mouseX - CAN_W / 2) * SPP);
    drawSlope(slope);
    ctx.fillStyle = "white";
    ctx.fillText(`mouseX: ${mouseX}`, 10, 20);
    ctx.fillText(`mouseY: ${mouseY}`, 10, 30);
    ctx.fillText(`${coefficient}`, 10, 40);
    ctx.fillText(`f ' : ${slope}`, 10, 55);
    const x = (mouseX - CAN_W / 2) * SPP;
    const y = equation(coefficient, x);
    ctx.fillText(`P (${Math.floor(x * 100) / 100}, ${Math.floor(y * 100) / 100})`, 10, 65);
    TMPcoefficient = coefficient.slice();
};

setInterval(mainLoop, 33);