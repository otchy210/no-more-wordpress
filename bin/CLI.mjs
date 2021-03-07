import readline from 'readline';

const isValidPosInt = (answer, min, max) => {
    if (!/[1-9][0-9]*/.test(answer)) {
        console.error(`${answer} is not a positive integer.`);
        return false;
    }
    const num = parseInt(answer);
    if (num < min) {
        console.error(`${num} is less than ${min}.`);
        return false;
    }
    if (max < num) {
        console.error(`${num} is more than ${max}.`);
        return false;
    }
    return true;
};

const isValidYN = (answer) => {
    if (answer === 'y') {
        return true;
    }
    if (answer === 'n') {
        return true;
    }
    console.error('Enter "y" or "n".');
    return false;
}

class CLI {
    constructor() {
        this.cli = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    async ask(question) {
        return new Promise(resolve => {
            this.cli.question(question, resolve);
        })
    }

    async askPosInt(question, min, max) {
        let answer;
        do {
            answer = await this.ask(question);
        } while (!isValidPosInt(answer, min, max));
        return answer;
    }

    async askYN(question) {
        let answer;
        do {
            answer = await this.ask(question);
        } while(!isValidYN(answer));
        return answer === 'y';
    }

    close() {
        this.cli.close();
    }
}

export default CLI;
