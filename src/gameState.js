function rand(max) {return Math.floor(Math.random() * (max+1))} // random integer
function randF(max) {return Math.random() * max} // random float
function coin() {return Math.random() < 0.5} // coin flip

class GameState {
  constructor(room) {
    this.room = room

    this.plr = [] // player IDs
    this.phase = 'setup' // setup -> teambuild -> combats -> result?
    this.teams = [[], []]
    this.currentlyOffering = [{}, {}]
    this.ready = ['none', 'none']
    this.rerolls[3, 3] // rerolls per player - shared between choosing spirits and upgrades

    this.firstChoice = coin()? '0': '1'
  }

  moveToTeambuild() {
    for (let i in plr) {
      currentlyOffering[i] = this.offerSpirit()
    }
    this.phase = "teambuild"
  }

  offerSpirit() {
    const newSpirit = {
      stats: {
        spd: 0,
        hp: 0,
        atk: 0,
        def: 0,
      },
      upgrade: "none"
    }
    let karma = 0 // system for slightly smoothing out powerlevel between spirits
    // higher roll on one stat means 50% chance of lower maximum on next

    let num = rand(4) // spd 8~12
    newSpirit.stats.spd = 8 + num
    karma = coin() ? num : 0

    num = rand(6 - karma) // hp 22~35
    newSpirit.stats.hp = 22 + num*2 + (coin() ? 1 : 0)
    karma = coin() ? num : 0

    num = rand(6 - karma) // atk 12~18
    newSpirit.stats.atk = 12 + num
    karma = coin() ? Math.floor(num/2) : 0

    num = rand(6 - karma) // def 6~11
    newSpirit.stats.def = 5 + num

    newSpirit.attributes = {
      height: 50 + 2*newSpirit.stats.hp + 8*newSpirit.stats.spd, // SPD, HP - 158~216
      bodyWidth: -5 + Math.floor(1.5*newSpirit.stats.hp) + 1*newSpirit.stats.def, // HP, DEF
      neckBaseRatio: 0.6*newSpirit.stats.def, // DEF
      leanForward: (newSpirit.stats.atk-12)**2/18, // ATK
      
      armLengthRatio: 0.1+0.05*newSpirit.stats.spd, // SPD
      armWidthRatio: -0.3 + (newSpirit.stats.def + newSpirit.stats.atk)*0.03, // ATK, DEF

      animSpeed: (newSpirit.stats.spd - 2) * 0.15, // SPD
      headType: 1 + rand(0)
    }

    return newSpirit
  }
}

export { GameState }