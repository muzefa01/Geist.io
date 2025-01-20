function rand(max) {return Math.floor(Math.random() * (max+1))} // random integer
function randF(max) {return Math.random() * max} // random float
function coin() {return Math.random() < 0.5} // coin flip

class GameState {
  constructor(room, io) {
    this.room = room
    this.io = io

    this.p = [] // players
    this.phase = 'setup' // setup -> teambuild -> combats -> result?
    this.teams = [[], []]
    this.currentlyOffering = [{}, {}]
  }

  moveToTeambuild() {
    for (let i in p) {
      currentlyOffering[i] = this.offerSpirit()
    }
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
    // higher roll on one stat means 50% change of lower maximum on next

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
      // height: 150 + rand()*120, // HP, SPD
      // bodyWidth: 30 + rand()*30, // HP, DEF
      // neckBaseRatio: 0.28 + rand()*0.37, // DEF
      // leanForward: rand()**2*20, // ATK
      // neckType: 1, // DEF
      
      // armLengthRatio: 0.5+rand()*0.2, // SPD
      // armWidthRatio: 0.35 + rand()*0.3, // ATK, DEF
      // weaponGrip: 1, // ATK, SPD

      // animSpeed: 0.8 + rand()*0.4,

      // weaponType: 1,
      // headType: 1
    }
  }
}

export { GameState }