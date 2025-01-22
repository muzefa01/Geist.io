import { Spirit, Battle } from './battle.js'
import { CharBody } from './charBody.js'

function opp(ind) {return ind*1 === 1 ? "0" : "1"}

class BattleAnims {
  constructor(owner, spirits, onComplete) { // spirits in [player, enemy] order
    this.owner = owner
    this.spirits = spirits
    this.onComplete = onComplete
    this.fightSpirits = []
    this.hpBars = []
    this.spiritBodies = []
    this.ongoing = false
    this.spiritHp = []
    this.tickers = [0, 0]
    this.tickThreshold = 300

    for (i in this.spirits) {
      const stats = this.spirits[i].stats
      this.fightSpirits.push(new Spirit("nameless", stats.spd, stats.atk, stats.def, stats.hp))
    }
    
    this.setup()
    this.fight()
  }

  setup() {
    const centre = {x: 400, y: 560}
    this.bodyCentres = []
    const sides = [-1, 1]
    for (let i in this.spirits) {
      this.bodyCentres.push({x: centre.x + sides[i]*320, y: centre.y})
      this.spiritBodies.push(new CharBody(
        this.owner, 
        this.bodyCentres[i],
        this.spirits[i].attributes
      ))
      this.spiritBodies[i].scale.x = sides[i] * -1
      this.owner.bodies.push(this.spiritBodies[i])

      this.spiritHp.push(this.spirits[i].stats.hp)
      this.hpBars.push(this.owner.add.graphics())
    }
  }

  fight() {
    this.updateBars()
    this.owner.currentBattle = this
    this.ongoing = true
  }

  update() {
    if (this.ongoing) {
      for (let i in this.spirits) {
        this.tickers[i] += this.spirits.stats.spd
      }
      for (let i in this.spirits) {
        if (this.tickers[i] >= this.tickThreshold && this.tickers[opp(i)] < this.tickThreshold) {
          this.attack(i)
        }
      }

    }
  }

  attack(i) {
    this.ongoing = false
    this.spiritHp[opp(i)] -= Math.max(this.spirits[i].atk - this.spirits[opp(i)].def, 0)
    this.updateBars()
    console.log(i +" ATTACKS,"+ opp(i) +"DOWN TO ["+ this.spiritHp[opp(i)] +"]")
    if (this.spiritHp[opp(i)] <= 0) {
      console.log("IT'S OVER")
      setTimeout(() => {
        this.ongoing = false
        this.spiritBodies[0].hide()
        this.spiritBodies[1].hide()
        this.hpBars[0].hide()
        this.hpBars[1].hide()
        this.onComplete(i) // winner
      }, 500)
    } else {
      setTimeout(() => {
        this.ongoing = true
      }, 200)
    }
  }

  updateBars() {
    const offsetY = 15
    const height = 20
    for (let i in this.hpBars) {
      const hp = this.spiritHp[i]
      this.hpBars[i].clear()
      this.hpBars[i].lineStyle(4, 0xFFFFFF, 0.0);
      this.hpBars[i].fillStyle(0xFFFFFF, 1);
      this.hpBars[i].fillRect(
        this.bodyCentres[i].x - hp/2, // x
        this.bodyCentres[i].y + offsetY, // y
        Math.max(hp * 3, 0), // w
        height // h
      )
    }
  }
}

export { BattleAnims }