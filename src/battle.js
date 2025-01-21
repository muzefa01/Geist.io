class Spirit {
    constructor(team1, team2) {
        // this.name = name
        // this.speed = speed
        // this.attack = attack
        // this.defence = defence
        // this.currentHealth = maxHealth
        // this.points = 0
        // this.ticker = 0

        this.team1 = team1.map(spirit => new Spirit(spirit)); 
        this.team2 = team2.map(spirit => new Spirit(spirit));
        this.ticker = 0; 
        this.currentCombatants = [this.team1[0], this.team2[0]]; 
        this.winner = null; 
    }

    incrementTicker() {
        this.currentCombatants.forEach(combatant => combatant.ticker());
      }

      resolveRound() {
        const [combatant1, combatant2] = this.currentCombatants;
    
        if (combatant1.ticker >= 100 && combatant2.ticker >= 100) {
          // Higher ticker goes first
          if (combatant1.ticker > combatant2.ticker) {
            this.attack(combatant1, combatant2);
          } else {
            this.attack(combatant2, combatant1);
          }
        } else if (combatant1.ticker >= 100) {
          this.attack(combatant1, combatant2);
        } else if (combatant2.ticker >= 100) {
          this.attack(combatant2, combatant1);
        }
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
}Z