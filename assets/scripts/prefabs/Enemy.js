class Enemy extends MovableObject {
  static generateAttr() {
    const x = config.width + 150;
    const y = Phaser.Math.Between(100, config.height - 100);
    const id = Phaser.Math.Between(1, 4);
    return { x, y, id };
  }

  static generate(scene, fires) {
    const data = Enemy.generateAttr();
    return new Enemy({
      scene,
      fires,
      x: data.x,
      y: data.y,
      texture: 'enemy',
      frame: `enemy${data.id}`,
      velocity: -250,
      bullet: {
        delay: 1000,
        texture: 'bullet',
        velocity: -500,
      },
      origin: { x: 0, y: 0.5 },
    });
  }

  init(data) {
    super.init(data);
    this.setOrigin(data.origin.x, data.origin.y);
    this.fires = data.fires || new Fires(this.scene);
    this.timer = this.scene.time.addEvent({
      delay: data.bullet.delay,
      loop: true,
      callback: this.fire,
      callbackScope: this,
    });
    this.bullet = data.bullet;
  }

  fire() {
    this.fires.createFire(this);
  }

  reset() {
    const data = Enemy.generateAttr();
    super.reset(data.x, data.y);
    this.setFrame(`enemy${data.id}`);
  }

  isDead() {
    return this.x < -this.width;
  }
}
