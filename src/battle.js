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
    ticker() {
        this.ticker += this.speed
    }

    attack(opponent) {
        const damage = (this.attack - opponent.defence)
        opponent.currentHealth -= damage

        if (opponent.currentHealth <= 0) { // death condition
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
        this.spirit1 = spirit1
        this.spirit2 = spirit2
    }

    startRound() {
        this.round++

        this.spirit1.attack()
        this.spirit2.attack()

        if (this.spirit1.ticker >= 100 && this.spirit2.ticker >= 100) {
            if (this.spirit1.ticker > this.spirit2.ticker) {
               if (this.spirit1.attack(this.spirit2)) {
                this.spirit1.points++
                //function to end the battle - pending
                return;
               }
               this.spirit1.resetTicker();
               
               if (this.spirit2.attack(this.spirit1)) {
                this.spirit2.points++
                //function to end the battle - pending
                return;
            }
            this.spirit2.resetTicker();
            } else {
                if (this.spirit2.attack(this.spirit1)) {
                    this.spirit2.points++
                    //function to end the battle - pending
                    return;
                }
                this.spirit2.resetTicker()

                if(this.spirit1.attack(this.spirit2)) {
                    this.spirit1.points++
                    //function to end the battle - pending
                    return;
                }
                this.spirit1.resetTicker()
            }
        }
    }
}