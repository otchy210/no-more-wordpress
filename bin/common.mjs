let args;
export const getArgs = () => {
    if (args) {
        return args;
    }
    if (process.argv.length <= 2) {
        args = {};
        return args;
    }
    args = {};
    process.argv.forEach((arg, i) => {
        if (i < 2) {
            return true;
        }
        if (arg.startsWith('--')) {
            const [name, value] = arg.substr(2).split('=');
            args[name] = value;
        }
    });
    return args;
};

export const getMode = () => {
    const mode = getArgs()['mode'];
    return mode ?? 'dev';
};

export const isDevMode = () => {
    return getMode() === 'dev';
}