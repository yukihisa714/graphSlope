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
/**
 * 係数とxから実数解を求める
 * @param {Array} coe 
 * @param {Number} x 
 * @returns 実数解
 */
const equation = (coe, x) => {
    let result = 0;
    let member = 1;
    // for (let i = 0; i < coe.length; i++) {
    //     result += coe[i] * (x ** (coe.length - 1 - i));
    // }
    for (let i = coe.length - 1; i >= 0; i--) {
        result += coe[i] * member;
        member *= x;
    }
    return result;
};

/**
 * 与えられた関数を微分する
 * @param {Array} coe 係数
 * @returns {Array} 引数より要素が一つ少ない
 */
const differential = (coe) => {
    const result = [];
    for (let i = 0; i < coe.length - 1; i++) {
        result[i] = coe[i] * (coe.length - 1 - i);
    }
    return result;
};

/**
 * 直線を引く関数
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @param {String} c color
 * @param {Number} w lineWidth
 */
const drawLine = (x1, y1, x2, y2, c, w) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

let points = [];

const makeGraphPoints = (arr) => {
    // const st = Date.now();
    points = [];
    for (let x = -CAN_W / 2; x < CAN_W / 2; x++) {
        const p1x = x * SPP;
        const p1y = -equation(arr, p1x);
        const p2x = x + CAN_W / 2;
        const p2y = p1y / SPP + CAN_H / 2;
        points.push({ x: p2x, y: p2y });
    }
    // console.log(Date.now() - st);
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
    for (let i = 0; i < coefficient.length; i++) {
        const range = document.createElement("input");
        range.type = "range";
        range.id = `cfs${i}`;
        range.classList.add("range");
        range.setAttribute("list", `markers`);
        range.value = coefficient[i];
        range.min = -10;
        range.max = 10;
        range.step = 0.2;
        cfs.appendChild(range);
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
    makeGraphPoints(coefficient);
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
};

setInterval(mainLoop, 33);