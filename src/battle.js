class Spirit {
    constructor(name, speed, attack, defence, maxHealth) {
        this.name = name
        this.speed = speed
        this.attack = attack
        this.defence = defence
        this.currentHealth = maxHealth
        this.points = 0
        this.ticker = 0
    }
    // incrementing ticker by its corresponding speed
    incrementTicker() {
        this.ticker += this.speed;
    }

    attack(opponent) {
        const damage = Math.max(this.attack - opponent.defence, 0)
        opponent.currentHealth -= damage
        console.log(`${this.name} attacks ${opponent.name} for ${damage} damage!`);

        if (opponent.currentHealth <= 0) { // death condition
            console.log(`${opponent.name} has been defeated!`);
            return true
        }
        return false
    }

    resetTicker() {
        this.ticker = 0
    }
}

class Battle {
    constructor(spirit1, spirit2) {
        this.spirit1 = spirit1;
        this.spirit2 = spirit2;
        this.round = 1;
    }

    startRound() {
        console.log(`Starting round ${this.round}!`);
        while (true) {
            // Increment tickers
            this.spirit1.incrementTicker();
            this.spirit2.incrementTicker();

            if (this.spirit1.ticker >= 100 || this.spirit2.ticker >= 100) {
                // Determine turn order
                const first = this.spirit1.ticker > this.spirit2.ticker ? this.spirit1 : this.spirit2;
                const second = first === this.spirit1 ? this.spirit2 : this.spirit1;

                // First spirit attacks
                if (first.attack(second)) {
                    first.points++;
                    this.endBattle(first);
                    break;
                }
                first.resetTicker();

                // Second spirit attacks if still alive
                if (second.attack(first)) {
                    second.points++;
                    this.endBattle(second);
                    break;
                }
                second.resetTicker();
            }
        }
    }

    endBattle(winner) {
        console.log(`${winner.name} wins the battle with ${winner.points} points!`);
    }
}

export { Spirit, Battle }