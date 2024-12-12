import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MD5 from 'crypto-js/md5';

const BattleScene = ({ battleResult, currentTurn, hitEffect }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: window.innerWidth - 700,
        height: window.innerHeight - 500,
        parent: 'battle-scene-container',
        scene: {
          init: function() {
            // Eliminamos las llamadas a bind aquí
          },
          preload: preload,
          create: create,
          update: update,
        },
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gameRef.current && gameRef.current.scene.scenes[0]) {
      const scene = gameRef.current.scene.scenes[0];
      scene.events.emit('updateRound', currentTurn);
    }
  }, [currentTurn]);

  useEffect(() => {
    if (gameRef.current && gameRef.current.scene.scenes[0] && hitEffect) {
      const scene = gameRef.current.scene.scenes[0];
      scene.events.emit('hitEffect', hitEffect);
    }
  }, [hitEffect]);

  function preload() {
    this.load.image('background', battleResult.rounds[0].environment.image);
    this.load.image('character1', battleResult.character1.image);
    this.load.image('character2', battleResult.character2.image);
  }

  function create() {
    const { width, height } = this.sys.game.canvas;

    // Fondo
    const background = this.add.image(width / 2, height / 2, 'background');
    background.setDisplaySize(width, height);

    // Personajes
    this.character1 = this.add.image(width * 0.25, height * 0.7, 'character1');
    this.character2 = this.add.image(width * 0.75, height * 0.7, 'character2');
    this.character1.setScale(0.5);
    this.character2.setScale(0.5);

    // Barras de vida
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    this.character1HealthBar = this.add.rectangle(width * 0.25, height * 0.1, healthBarWidth, healthBarHeight, 0x00ff00);
    this.character2HealthBar = this.add.rectangle(width * 0.75, height * 0.1, healthBarWidth, healthBarHeight, 0x00ff00);

    // Contadores de vida
    this.character1HealthText = this.add.text(width * 0.25, height * 0.15, '', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
    this.character2HealthText = this.add.text(width * 0.75, height * 0.15, '', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

    // Nombres de los personajes
    this.add.text(width * 0.25, height * 0.05, battleResult.character1.name, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width * 0.75, height * 0.05, battleResult.character2.name, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

    // Texto narrativo
    this.narrativeText = this.add.text(width / 2, height * 0.9, '', { fontSize: '18px', color: '#ffffff', align: 'center', wordWrap: { width: width * 0.8 } }).setOrigin(0.5);

    // Vinculamos las funciones aquí
    this.updateRound = updateRound.bind(this);
    this.updateHealthBars = updateHealthBars.bind(this);
    this.animateAttack = animateAttack.bind(this);
    this.showDamage = showDamage.bind(this);
    this.showHitEffect = showHitEffect.bind(this);

    // Eventos
    this.events.on('updateRound', this.updateRound);
    this.events.on('hitEffect', this.showHitEffect);

    // Animación de "respiración"
    this.tweens.add({
      targets: [this.character1, this.character2],
      y: '+=5',
      yoyo: true,
      duration: 1000,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  function update() {
    // Lógica de actualización si es necesaria
  }

  function updateRound(round) {
    if (battleResult.rounds[round]) {
      const roundData = battleResult.rounds[round];
      this.updateHealthBars(roundData);
      this.animateAttack(roundData);
      this.narrativeText.setText(roundData.narrative);
    }
  }

  function updateHealthBars(roundData) {
    const char1HealthPercentage = roundData.character1.hp / battleResult.character1.initial_hp;
    const char2HealthPercentage = roundData.character2.hp / battleResult.character2.initial_hp;
    
    this.tweens.add({
      targets: this.character1HealthBar,
      scaleX: char1HealthPercentage,
      duration: 1000,
      ease: 'Power2'
    });
    this.tweens.add({
      targets: this.character2HealthBar,
      scaleX: char2HealthPercentage,
      duration: 1000,
      ease: 'Power2'
    });

    this.character1HealthText.setText(`${Math.round(roundData.character1.hp)}/${battleResult.character1.initial_hp}`);
    this.character2HealthText.setText(`${Math.round(roundData.character2.hp)}/${battleResult.character2.initial_hp}`);
  }

  function animateAttack(roundData) {
    const attacker = roundData.character1.is_attacker ? this.character1 : this.character2;
    const defender = roundData.character1.is_attacker ? this.character2 : this.character1;
    
    this.tweens.add({
      targets: attacker,
      x: defender.x - (roundData.character1.is_attacker ? -100 : 100),
      yoyo: true,
      duration: 500,
      ease: 'Power2',
      onComplete: () => this.showDamage(roundData)
    });
  }

  function showDamage(roundData) {
    const defender = roundData.character1.is_attacker ? this.character2 : this.character1;
    const damageText = this.add.text(defender.x - 50, defender.y - 150, roundData.damage.toFixed(1), { fontSize: '40px', color: '#ff0000' });
    
    if (roundData.character1.is_attacker ? roundData.character1.action === '¡golpe crítico!' : roundData.character2.action === '¡golpe crítico!') {
      damageText.setColor('#ff00ff');
      damageText.setText(`¡CRÍTICO!\n${roundData.damage.toFixed(1)}`);
    }

    this.tweens.add({
      targets: damageText,
      y: defender.y - 300,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => damageText.destroy()
    });
  }

  function showHitEffect(characterName) {
    const character = characterName === battleResult.character1.name ? this.character1 : this.character2;
    this.tweens.add({
      targets: character,
      alpha: 0.5,
      yoyo: true,
      duration: 100,
      repeat: 5
    });
  }

  return <div className="battle-scene-container" id="battle-scene-container" />
};

export default BattleScene;