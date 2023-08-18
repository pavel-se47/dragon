class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
    this.fires = new Fires(this.scene);
    this.enemyMax = 5;
    this.enemyCreated = 0;
    this.enemyKilled = 0;

    this.timer = this.scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: this.enemyCount,
      callbackScope: this,
    });
  }

  enemyCount() {
    if (this.enemyCreated < this.enemyMax) {
      this.createEnemy();
    } else {
      this.timer.remove();
    }
  }

  onEnemyKilled() {
    this.enemyKilled += 1;
    if (this.enemyKilled >= this.enemyMax) {
      this.scene.events.emit('enimies-killed');
    }
  }

  createEnemy() {
    let enemy = this.getFirstDead();

    if (!enemy) {
      enemy = Enemy.generate(this.scene, this.fires);
      enemy.on('killed', this.onEnemyKilled, this);
      this.add(enemy);
    } else {
      enemy.reset();
    }

    enemy.move();
    this.enemyCreated += 1;
  }
}
