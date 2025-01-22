class StatBlock {
  constructor(owner, pos, spirit) {
    this.owner = owner
    this.stats = spirit.stats
    this.headType = spirit.attributes.headType
    this.pos = pos
    const statRef = ["atk", "def", "hp", "spd"]
    this.texts = []

    for (let i in statRef) {
      this.texts.push(
        this.owner.add.text(
          this.pos.x, this.pos.y-45 + 30*i, 
            `${statRef[i].toUpperCase()}: ${this.stats[statRef[i]]}`, {
              fontFamily: '"IM Fell English", serif',
              fontSize: 24,
              color: "#ffffff",
              fontStyle: "normal",
        }
      ))
    }


  }

  destroy() {
    for (let i in statRef) {
      this.texts[i].destroy()
    }
  }
}

export { StatBlock }