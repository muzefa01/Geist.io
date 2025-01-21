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

//counting in miliseconds for the timers

/*

Create a “ticker” for each spirit - a counter that counts up by speed every round (“tick”)
When a spirit’s ticker elapses eg. 100, take it back down by 100 and they attack
i. e. if a spirit has 26 speed, their ticker would follow: 26, 52, 78, 104 (ATTACK) → 4, 30… while an opponent with lower speed may not reach 100 on tick 4
if both spirits elapse 100 on the same “tick”, the one with a higher count goes first
When a spirit attacks its opponent it will deal attack - opponentDefense damage to its opponent. (the minimum damage value should be 0)
After a spirit has attacked, check if its opponent is alive 
(the death condition is currentHealth <= 0)
If the defending spirit did not die, reset the attacking spirit’s timer
If the defending spirit died, end combat
When combat ends, give one point to the winner
If the winner has less than 2 points, begin a new combat with the next 2 spirits
bonus: make the threshold for each spirit’s timer proportional to its Speed stat

*/