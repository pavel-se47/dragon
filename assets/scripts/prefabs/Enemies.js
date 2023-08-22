class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.scene = scene;
    this.fires = new Fires(this.scene);
    this.enemyMax = 3;
    this.enemyCreated = 0;
    this.enemyKilled = 0;
    this.timer = this.scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: this.enemyCount,
      callbackScope: this,
    });

    this.changeEnemyMax();
  }

  changeEnemyMax() {
    if (this.scene.currentWave === 2) {
      this.enemyMax = 6;
    } else if (this.scene.currentWave === 3) {
      this.enemyMax = 9;
    } else if (this.scene.currentWave === 4) {
      this.enemyMax = 12;
    } else if (this.scene.currentWave === 5) {
      this.enemyMax = 15;
    }
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
