const getSize = () => {
    return min(windowWidth, windowHeight);
};

const app = {
    colors: [
        "#198754",
        "#0d6efd",
        "#ffc107",
        "#6f42c1",
        "#0dcaf0",
        "#dc3545",
        "#d63384",
        "#6610f2",
        "#fd7e14",
    ],
    bgColor: "#333",
    textColor: "#fff",
    // display objects
    arcs: [
        {
            getValue: (now) => now.getHours() + now.getMinutes() / 60,
            getArcValue: (now) => (now.getHours() % 12) + now.getMinutes() / 60,
            max: 12,
            d: 0.35,
            w: 0.1,
            c: 0,
        },
        {
            getValue: (now) =>
                now.getMinutes() +
                now.getSeconds() / 60 +
                now.getMilliseconds() / 60000,
            max: 60,
            d: 0.6,
            w: 0.08,
            c: 0,
        },
        {
            getValue: (now) => now.getSeconds() + now.getMilliseconds() / 1000,
            max: 60,
            d: 0.8,
            w: 0.06,
            c: 0,
        },
        {
            getValue: (now) =>
                (now.getSeconds() + now.getMilliseconds() / 1000) % 10,
            max: 10,
            d: 0.95,
            w: 0.04,
            c: 0,
            hideText: true,
        },
    ],
    angleOffset: -90,
};
setup = () => {
    const s = getSize();
    createCanvas(s, s);

    // randomizing colors
    app.colors
        .sort(() => random() - 0.5)
        .filter((c, i) => i < app.arcs.length)
        .forEach((c, i) => (app.arcs[i].c = c));

    // defining modes
    ellipseMode(CENTER);
    angleMode(DEGREES);
    textAlign(CENTER, CENTER);
};

windowResized = () => {
    const s = getSize();
    resizeCanvas(s, s);
};

draw = () => {
    background(app.bgColor);

    const now = new Date();

    app.arcs.forEach((a) => {
        // arc
        noFill();
        stroke(a.c);
        strokeWeight(width * a.w);
        const val = a.getValue(now);
        const arcValue = a.getArcValue && a.getArcValue(now);
        const centerPos = createVector(width / 2, height / 2);
        const angle = ((arcValue || val) / a.max) * 360;
        const invert = (arcValue || val) / a.max > 0.5;
        arc(
            centerPos.x,
            centerPos.y,
            width * a.d,
            height * a.d,
            invert ? angle + app.angleOffset : app.angleOffset,
            invert ? 360 + app.angleOffset : angle + app.angleOffset
        );

        // line
        const target = createVector(0, -(height * (a.d / 2)));
        target.rotate(angle);
        target.add(centerPos);
        line(centerPos.x, centerPos.y, target.x, target.y);

        // text
        if (window.config.showText && !a.hideText) {
            fill(app.textColor);
            noStroke();
            textSize(width * a.w * 0.8);
            text(Math.floor(val), target.x, target.y);
        }
    });

    describe(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
};
