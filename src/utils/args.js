
function getParam(id) {
    return process.argv[id + 2];
}

function getFlagByKey(key, short = false) {
    return process.argv.indexOf(`--${key}`) !== -1 || (short && process.argv.indexOf(`-${key.substring(0, 1)}`) !== -1);
}

function getArgByKey(key, short = false) {
    const argIndex = process.argv.indexOf(`--${key}`);
    if (argIndex === -1) {
        if (short) {
            const argIndexShort = process.argv.indexOf(`-${key.substring(0, 1)}`);
            return argIndexShort === -1 ? null : process.argv[argIndexShort + 1];
        } else {
            return null;
        }
    } else {
        return argIndex === -1 ? null : process.argv[argIndex + 1];
    }
}

function getArgsByKey(key, short = false) {
    const values = [];
    let argIndex = process.argv.indexOf(`--${key}`);
    while (argIndex !== -1) {
        values.push(process.argv[argIndex + 1]);
        argIndex = process.argv.indexOf(`--${key}`, argIndex + 1);
    }
    if (short) {
        let argIndexShort = process.argv.indexOf(`-${key.substring(0, 1)}`);
        while (argIndexShort !== -1) {
            values.push(process.argv[argIndexShort + 1]);
            argIndexShort = process.argv.indexOf(`-${key.substring(0, 1)}`, argIndexShort + 1);
        }
    }
    return values;
}

function getArgsValuesByKey(key, count, short = false) {
    const values = [];
    let argIndex = process.argv.indexOf(`--${key}`);
    while (argIndex !== -1) {
        values.push(process.argv.slice(argIndex + 1, argIndex + 1 + count));
        argIndex = process.argv.indexOf(`--${key}`, argIndex + 1);
    }
    if (short) {
        let argIndexShort = process.argv.indexOf(`-${key.substring(0, 1)}`);
        while (argIndexShort !== -1) {
            values.push(process.argv.slice(argIndexShort + 1, argIndexShort + 1 + count));
            argIndexShort = process.argv.indexOf(`-${key.substring(0, 1)}`, argIndexShort + 1);
        }
    }
    return values;
}

module.exports = {
    getParam,
    getFlagByKey,
    getArgByKey,
    getArgsByKey,
    getArgsValuesByKey,
};