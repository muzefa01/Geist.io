import { Spirit, Battle } from './battle.js'
import { CharBody } from './charBody.js'

function opp(ind) {return ind*1 === 1 ? "0" : "1"}
const rand = Math.random
function fudge(k) {return (rand()-0.5)*k*2}
function slideCall(target, origin, looseness, callback) {
  let ticks = 22
  const intId = setInterval(() => {
    if (ticks > 0) {
      ticks --
      callback(origin)
      origin = target + (origin - target)*looseness
    } else {
      callback(target)
      clearInterval(intId)
    }
  }, 16);
}

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
    this.tickThreshold = 400 //400
    this.particles = []

    console.log(this.spirits)
    for (let i in this.spirits) {
      const stats = this.spirits[i].stats
      this.fightSpirits.push(new Spirit("nameless", stats.spd, stats.atk, stats.def, stats.hp))
    }
    
    this.setup()
    this.fight()
  }

  setup() {
    const centre = {x: 400, y: 550}
    this.bodyCentres = []
    const sides = [-1, 1]
    for (let i in this.spirits) {
      this.bodyCentres.push({x: centre.x + sides[i]*150, y: centre.y})
      this.spiritBodies.push(new CharBody(
        this.owner, 
        this.bodyCentres[i],
        this.spirits[i].attributes
      ))
      this.spiritBodies[i].scale.x = sides[i] * 1
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
    for (let i in this.particles) {
      this.particles[i].update()
    }

    if (this.ongoing) {
      for (let i in this.spirits) {
        this.tickers[i] += this.spirits[i].stats.spd
      }
      for (let i in this.spirits) {
        if (this.tickers[i] >= this.tickThreshold && this.tickers[opp(i)] < this.tickThreshold) {
          this.attack(i)
        }

        if (this.tickers[i] >= this.tickThreshold && this.tickers[opp(i)] > this.tickThreshold) {
          if (this.spirits[i].stats.initiative > this.spirits[opp(i)].stats.initiative) {
            this.attack(i)
          } else {
            this.attack(opp(i))
          }
        }
      }

    }
  }

  attack(i) {
    const sides = [-1, 1]
    this.ongoing = false
    const dmg = Math.max(this.spirits[i].stats.atk - this.spirits[opp(i)].stats.def, 1)
    this.spiritHp[opp(i)] -= dmg
    this.updateBars()
    slideCall(0, -0.8, 0.85, (a) => {
      this.spiritBodies[i].atkAngle = a
    })
    slideCall(this.spiritBodies[i].basePos.x, this.spiritBodies[i].basePos.x-(4.5*(this.spirits[i].stats.atk - 7))*sides[i], 0.85, (a) => {
      this.spiritBodies[i].basePos.x = a
    })
    console.log(i +" ATTACKS, "+ opp(i) +" DOWN TO ["+ this.spiritHp[opp(i)] +"]")
    this.tickers[i] -= this.tickThreshold
    if (this.spiritHp[opp(i)] <= 0) {
      this.particles.push(new ParticleBurst(this.owner, {
          x: this.spiritBodies[opp(i)].basePos.x, 
          y: this.spiritBodies[opp(i)].basePos.y - 140
        }, {
          x: 2 * sides[opp(i)],
          y: 0
        }, {
          x: 15,
          y: 10
        }, {
          x: 1.2,
          y: 1.6
        }, (dmg + 1)*2, 200))
      this.ongoing = false
      this.finished = true
      this.spiritBodies[opp(i)].hide()
      setTimeout(() => {
        this.spiritBodies[0].hide()
        this.spiritBodies[1].hide()
        this.hpBars[0].clear()
        this.hpBars[1].clear()
        this.onComplete(i) // winner
      }, 1500)
    } else {
      this.particles.push(new ParticleBurst(this.owner, {
          x: this.spiritBodies[opp(i)].basePos.x, 
          y: this.spiritBodies[opp(i)].basePos.y - 140
        }, {
          x: 1.5 * sides[opp(i)],
          y: 0
        }, {
          x: 8,
          y: 4
        }, {
          x: 0.8,
          y: 0.8
        }, dmg + 1, 100))
      setTimeout(() => {
        if (!this.finished) this.ongoing = true
      }, 200) //200
    }
  }

  updateBars() {
    const offsetY = 10
    const height = 30
    for (let i in this.hpBars) {
      const hp = this.spiritHp[i]
      this.hpBars[i].clear()
      this.hpBars[i].lineStyle(4, 0xFFFFFF, 0.0);
      this.hpBars[i].fillStyle(0xFFFFFF, 1);
      this.hpBars[i].fillRect(
        this.bodyCentres[i].x - hp * 2.5, // x
        this.bodyCentres[i].y + offsetY, // y
        Math.max(hp * 5, 0), // w
        height // h
      )
    }
  }
}

class ParticleBurst {
  constructor(owner, pos, vel, pSpread, vSpread, num, lifetime) {
    this.owner = owner
    this.pos = pos
    this.vel = vel
    this.pSpread = pSpread
    this.vSpread = vSpread 
    this.num = num
    this.particles = []
    this.lifeLeft = lifetime

    for (let i = 0; i < num; i++) {
      this.particles.push(this.owner.add.image(
        this.pos.x + this.pSpread.x*fudge(1),
        this.pos.y + this.pSpread.y*fudge(1),
        'strike'
      ).setDepth(10).setScale(1))
      this.particles[i].vel = {
        x: this.vel.x + this.vSpread.x*fudge(1),
        y: this.vel.y + this.vSpread.y*fudge(1)
      }
      console.log(this.particles[i].vel)
    }
  }

  update() {
    this.lifeLeft --
    if (this.lifeLeft >= 0) for (let i in this.particles) {
      this.particles[i].x += this.particles[i].vel.x
      this.particles[i].y += this.particles[i].vel.y
      this.particles[i].vel.x *= 0.97
      this.particles[i].vel.y *= 0.97
      this.particles[i].setScale(this.particles[i].scaleX * 0.98)
      this.particles[i].setVisible(rand() < 0.7)
    }  
    if (this.lifeLeft <= 0) {
      for (let i in this.particles) {
        this.particles[i].setVisible(false)
      }
    } 
  }
}

export { BattleAnims }