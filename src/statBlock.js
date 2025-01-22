class StatBlock {
  constructor(owner, pos, spirit, headOn = true) {
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
    if (headOn) {
      this.head = this.owner.add.image(this.pos.x-60, this.pos.y+20, 'head'+this.headType)
      this.head.setScale(0.75).setRotation(-0.15)
    }

  }

  destroy() {
    const statRef = ["atk", "def", "hp", "spd"]
    for (let i in statRef) {
      this.texts[i].destroy()
    }
    if (this.head) this.head.destroy()
  }

  hide() {
    const statRef = ["atk", "def", "hp", "spd"]
    for (let i in statRef) {
      this.texts[i].setVisible(false)
    }
    if (this.head) this.head.setVisible(false)
  }

  show() {
    const statRef = ["atk", "def", "hp", "spd"]
    for (let i in statRef) {
      this.texts[i].setVisible(true)
    }
    if (this.head) this.head.setVisible(true)
  }
  
}

export { StatBlock }