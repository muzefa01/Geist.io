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