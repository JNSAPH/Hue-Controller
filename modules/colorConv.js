exports.hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return rgbToXY(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16))
}

exports.xyBriToRgb = (x, y, bri) => {
    z = 1.0 - x - y;

    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255; if (r < 0) { r = 255 };
    g = g * 255; if (g < 0) { g = 255 };
    b = b * 255; if (b < 0) { b = 255 };

    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);

    if (r.length < 2)
        r = "0" + r;
    if (g.length < 2)
        g = "0" + g;
    if (b.length < 2)
        b = "0" + r;
    rgb = "#" + r + g + b;

    return rgb;
}

function rgbToXY(r, g, b) {
    const rFinal = enhanceColor(r / 255),
        gFinal = enhanceColor(g / 255),
        bFinal = enhanceColor(b / 255);

    const x = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109,
        y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598,
        z = rFinal * 0.000000 + gFinal * 0.053077 + bFinal * 1.035763;

    const sum = x + y + z;

    if (sum == 0) {
        return { x: 0, y: 0 };
    }
    return `[${x / sum}, ${y / sum}]`
}

function enhanceColor(normalized) {
    if (normalized > 0.04045) {
        return Math.pow((normalized + .055) / (1 + .055), 2.4);
    }

    return normalized / 12.92;
}