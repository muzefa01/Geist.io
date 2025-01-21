class Battle {
    constructor(spirit1, spirit2, roomCode, io) {
      this.spirit1 = spirit1; 
      this.spirit2 = spirit2; 
      this.ticker1 = 0;
      this.ticker2 = 0;
      this.roomCode = roomCode;
      this.io = io;
      this.interval = null;
    }
  
    start() {
      this.interval = setInterval(() => this.incrementTicker(), 100);
    }
  
    incrementTicker() {
      this.ticker1 += this.spirit1.stats.spd;
      this.ticker2 += this.spirit2.stats.spd;
  
      if (this.ticker1 >= 100) {
        this.resolveRound(this.spirit1, this.spirit2);
        this.ticker1 -= 100;
      }
      if (this.ticker2 >= 100) {
        this.resolveRound(this.spirit2, this.spirit1);
        this.ticker2 -= 100;
      }
    }
  
    resolveRound(attacker, defender) {
      const damage = Math.max(attacker.stats.atk - defender.stats.def, 0);
      defender.stats.hp -= damage;
  
      this.io.to(this.roomCode).emit('updateHealth', {
        attackerName: attacker.name,
        defenderName: defender.name,
        damage,
        defenderHP: defender.stats.hp,
      });
  
      if (defender.stats.hp <= 0) {
        clearInterval(this.interval);
        const winner = attacker === this.spirit1 ? 0 : 1; // 0 for player 1, 1 for player 2
        this.io.to(this.roomCode).emit('battleResult', winner);
      }
    }
  }
  
  export { Battle };
  