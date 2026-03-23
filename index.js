let red = document.getElementById("red")
let blue = document.getElementById("blue")
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let Mdelay = 50
let count = 2
const mode = "triple" // double, triple, single, fast, alternating
const l = document.getElementById('red');
const r = document.getElementById('blue');
tick = 0;

lightInterval = setInterval(() => {
    tick++;
    l.classList.remove('active');
    r.classList.remove('active');

    if (mode === 'double') {
        // Вспышка-пауза-вспышка слева, потом справа
        let step = tick % 12;
        if (step === 0 || step === 2) l.classList.add('active');
        if (step === 6 || step === 8) r.classList.add('active');
    }
    else if (mode === 'triple') {
        let step = tick % 16;
        if (step === 0 || step === 2 || step === 4) l.classList.add('active');
        if (step === 8 || step === 10 || step === 12) r.classList.add('active');
    }
    else if (mode === 'single') {
        let step = tick % 4;
        if (step === 0) l.classList.add('active');
        if (step === 2) r.classList.add('active');
    }



    else if (mode === 'fast') {
        let step = tick % 2;
        if (step === 0) l.classList.add('active'); else r.classList.add('active');
    }
    else if (mode === 'alternating') {
        // По 5 быстрых вспышек каждой стороной
        let sideStep = Math.floor(tick / 10) % 2;
        if (tick % 2 === 0) {
            if (sideStep === 0) l.classList.add('active');
            else r.classList.add('active');
        }
    }
}, 60);


let audioCtx = null;
let mainOsc = null;
let currentMode = null;
let hornNodes = [];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}


function createDistortionCurve(amount = 80) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}


function startSirenLogic(type) {
    if (!audioCtx) return;

    mainOsc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    mainOsc.type = 'sawtooth';
    filter.type = "lowpass";
    filter.frequency.value = 2000;

    const now = audioCtx.currentTime;
    const vol = 1;
    gainNode.gain.setValueAtTime(vol * 0.3, now);

    if (type === 'wail') {
        mainOsc.frequency.setValueAtTime(400, now);
        for (let i = 0; i < 100; i++) {
            mainOsc.frequency.exponentialRampToValueAtTime(1100, now + i * 4 + 2);
            mainOsc.frequency.exponentialRampToValueAtTime(400, now + i * 4 + 4);
        }
    } else if (type === 'yelp') {
        mainOsc.frequency.setValueAtTime(500, now);
        for (let i = 0; i < 400; i++) {
            mainOsc.frequency.exponentialRampToValueAtTime(1200, now + i * 0.6 + 0.3);
            mainOsc.frequency.exponentialRampToValueAtTime(500, now + i * 0.6 + 0.6);
        }
    } else if (type === 'hilo') {
        for (let i = 0; i < 200; i++) {
            mainOsc.frequency.setValueAtTime(700, now + i * 0.8);
            mainOsc.frequency.setValueAtTime(500, now + i * 0.8 + 0.4);
        }
    } else if (type === 'manual') {
        mainOsc.frequency.setValueAtTime(400, now);
        mainOsc.frequency.exponentialRampToValueAtTime(1200, now + 1.5);
        mainOsc.frequency.exponentialRampToValueAtTime(400, now + 3.5);
    }

    mainOsc.connect(filter).connect(gainNode).connect(audioCtx.destination);
    mainOsc.start();
}

function toggleSiren(type) {
    initAudio();

    if (currentMode === type) {
        if (mainOsc) { mainOsc.stop(); mainOsc = null; }
        currentMode = null;
    } else {
        if (currentMode) {
            if (mainOsc) { mainOsc.stop(); mainOsc = null; }
        }
        currentMode = type;

        startSirenLogic(type);
    }
}

function playHorn() {
    initAudio();
    const now = audioCtx.currentTime;


    if (mainOsc) {
        try { mainOsc.stop(); } catch (e) { }
        mainOsc = null;
    }

    const dist = audioCtx.createWaveShaper();
    dist.curve = createDistortionCurve(150);

    const f = audioCtx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2000;

    const g = audioCtx.createGain();
    const vol = 1;
    g.gain.setValueAtTime(vol * 0.7, now);

    [130, 132, 128].forEach(freq => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 40;
        const lfoG = audioCtx.createGain();
        lfoG.gain.value = 20;

        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        osc.connect(dist);

        lfo.start();
        osc.start();
        hornNodes.push(osc, lfo);
    });

    dist.connect(f).connect(g).connect(audioCtx.destination);
    hornNodes.push(g, dist, f);
}

function stopHorn() {
    const now = audioCtx.currentTime;

    hornNodes.forEach(node => {
        if (node instanceof OscillatorNode) {
            try { node.stop(now + 0.1); } catch (e) { }
        }
    });
    hornNodes = [];


    if (currentMode) {

        setTimeout(() => {
            if (currentMode && !mainOsc) {
                startSirenLogic(currentMode);
            }
        }, 50);
    }
}