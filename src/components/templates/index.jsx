import { useEffect, useRef } from "react";
import kaboom from "kaboom";
import { heros } from "../../context/data";

export function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const vw = window.innerWidth - 4;
    const vh = window.innerHeight - 4;
    let hero = "player1";

    const k = kaboom({
      canvas: canvasRef.current,
      width: vw,
      height: vh,
      global: false,
      background: [0, 0, 0],
    });

    const SPEED = 600;
    let lives = 3;
    const spawnInterval = 3.2;
    const enemySpeedByLevel = [0, 250, 300, 350, 400, 450];
    let level = 1;
    const maxLevel = 5;
    const levelDuration = 30;
    let levelProgress = 0;
    let elapsedTime = 0;
    let currentEnemySpeed = enemySpeedByLevel[level];
    let coinCount = 0;
    const hearts = [];
    let gameOverTriggered = false;

    k.setGravity(2400);

    let levelBar, levelFill, timeText, coinText, levelText;

    // === Arka Plan ===
    k.loadSprite("bg", "/src/assets/bg.png").then((tex) => {
      k.add([
        k.sprite("bg"),
        k.pos(0, 0),
        k.scale(vw / tex.width, vh / tex.height),
        k.anchor("topleft"),
        k.fixed(),
        k.z(-100),
      ]);
    });

    Promise.all([
      k.loadSprite("player", "/src/assets/hero-1.png"),
      k.loadSprite("stage", "/src/assets/stage-1.png"),
      k.loadSprite("enemy", "/src/assets/enemy-1.png"),
      k.loadSprite("enemy1", "/src/assets/enemy-2.png"),
      k.loadSprite("enemy2", "/src/assets/enemy-3.png"),
      k.loadSprite("enemy3", "/src/assets/enemy-4.png"),
      k.loadSprite("enemy4", "/src/assets/enemy-5.png"),
      k.loadSprite("heart", "/src/assets/heart.gif"),
      k.loadSprite("coin", "/src/assets/coin.png"),
      k.loadSound("score", "/src/assets/score.mp3"),
      k.loadSound("game-over", "/src/assets/game-over.mp3"),
      k.loadSound("jump", "/src/assets/jump.mp3"),
      k.loadSound("lose-heart", "/src/assets/lose-heart.mp3"),
    ]).then(() => {
      const player = k.add([
        k.sprite("player"),
        k.pos(vw / 2, vh / 2 + 200),
        k.area(),
        k.scale(0.2),
        k.body(),
        k.anchor("bot"),
        "player",
      ]);

      const stageWidth = vw * 0.7;
      const stageHeight = 100;

      const platforms = [
        [vw / 2, vh / 2 - 180],
        [-300, vh / 2 + 70],
        [vw + 300, vh / 2 + 70],
        [vw / 2, vh / 2 + 300],
      ];

      platforms.forEach(([x, y]) => {
        k.add([
          k.sprite("stage"),
          k.pos(x, y),
          k.area({ shape: new k.Rect(k.vec2(0), stageWidth, stageHeight) }),
          k.body({ isStatic: true }),
          k.anchor("bot"),
          k.scale(stageWidth / 1480, stageHeight / 149),
        ]);
      });

      // HUD
      levelBar = k.add([
        k.rect(200, 20),
        k.pos(vw - 250, 30),
        k.color(80, 80, 80),
        k.fixed(),
        k.z(100),
      ]);

      levelFill = k.add([
        k.rect(0, 20),
        k.pos(vw - 250, 30),
        k.color(0, 255, 100),
        k.fixed(),
        k.z(101),
      ]);

      timeText = k.add([
        k.text("Time: 00:00", { size: 24 }),
        k.pos(vw / 2, 30),
        k.anchor("center"),
        k.fixed(),
        k.color(255, 255, 255),
      ]);

      coinText = k.add([
        k.text("Coins: 0", { size: 24 }),
        k.pos(30, 30),
        k.fixed(),
      ]);

      levelText = k.add([
        k.text("Level: 1", { size: 24 }),
        k.pos(30, 60),
        k.fixed(),
      ]);

      const updateHUD = () => {
        coinText.text = `Coins: ${coinCount}`;
        levelText.text = `Level: ${level}`;

        const minutes = Math.floor(elapsedTime / 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor(elapsedTime % 60)
          .toString()
          .padStart(2, "0");
        timeText.text = `Time: ${minutes}:${seconds}`;

        const fillWidth = Math.min((levelProgress / levelDuration) * 200, 200);
        levelFill.width = fillWidth;
      };

      const showGameOver = () => {
        gameOverTriggered = true;
        k.play("game-over");

        const minutes = Math.floor(elapsedTime / 60)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor(elapsedTime % 60)
          .toString()
          .padStart(2, "0");
        const duration = `${minutes}:${seconds}`;

        let title = "Rookie Adventurer";
        if (elapsedTime >= 180) title = "Veteran Survivor";
        else if (elapsedTime >= 120) title = "Determined Explorer";
        else if (elapsedTime >= 60) title = "Quick Learner";

        const overlay = k.add([
          k.rect(vw, vh),
          k.pos(0, 0),
          k.color(0, 0, 0),
          k.opacity(0),
          k.fixed(),
          k.z(998),
        ]);
        k.tween(0, 0.6, 1, (val) => (overlay.opacity = val));

        k.add([
          k.rect(vw, vh),
          k.pos(0, 0),
          k.color(0, 0, 0),
          k.opacity(0.4),
          k.fixed(),
          k.z(999),
        ]);

        const texts = [
          { text: "GAME OVER", size: 48, y: vh / 2 - 100, color: [255, 0, 0] },
          { text: `Coins Collected: ${coinCount}`, size: 24, y: vh / 2 - 20 },
          { text: `Time Survived: ${duration}`, size: 24, y: vh / 2 + 20 },
          {
            text: `Title: ${title}`,
            size: 24,
            y: vh / 2 + 60,
            color: [0, 255, 255],
          },
        ];

        texts.forEach((t, i) => {
          const label = k.add([
            k.text(t.text, { size: t.size }),
            k.pos(vw / 2, t.y + 30),
            k.anchor("center"),
            k.color(t.color || [255, 255, 255]),
            k.z(1000),
            k.opacity(0),
          ]);

          k.wait(i * 0.3, () => {
            k.tween(0, 1, 0.5, (val) => (label.opacity = val));
            k.tween(label.pos.y, t.y, 0.5, (val) => (label.pos.y = val));
          });
        });

        // === Retry Button ===
        k.wait(1.5, () => {
          const retryBtn = k.add([
            k.text("Try Again", { size: 28 }),
            k.pos(vw / 2, vh / 2 + 120),
            k.area(),
            k.anchor("center"),
            k.z(1001),
            k.color(255, 255, 255),
            k.scale(1),
          ]);

          retryBtn.onClick(() => {
            window.location.reload();
          });

          retryBtn.onHover(() => {
            retryBtn.scale = k.vec2(1.2);
          });

          retryBtn.onHoverEnd(() => {
            retryBtn.scale = k.vec2(1);
          });
        });
      };

      const addHearts = () => {
        for (let i = 0; i < lives; i++) {
          const heart = k.add([
            k.sprite("heart"),
            k.pos(30 + i * 40, 100),
            k.fixed(),
            k.scale(0.1),
            `heart-${i}`,
          ]);
          hearts.push(heart);
        }
      };

      const resetPlayer = () => {
        player.pos = k.vec2(vw / 2, vh / 2 + 200);
        loseLife();
      };

      const loseLife = () => {
        if (lives <= 0 || gameOverTriggered) return;
        lives--;
        k.destroy(hearts[lives]);
        k.play("lose-heart");

        if (lives === 0) {
          player.use(k.body({ isStatic: true }));
          showGameOver();
        }
      };

      addHearts();

      k.onKeyDown("left", () => {
        if (!gameOverTriggered) {
          player.move(-SPEED, 0);
          player.flipX = true;
        }
      });

      k.onKeyDown("right", () => {
        if (!gameOverTriggered) {
          player.move(SPEED, 0);
          player.flipX = false;
        }
      });

      k.onKeyPress("space", () => {
        if (player.isGrounded() && !gameOverTriggered) {
          player.jump(1200);
          k.play("jump");
        }
      });

      player.onCollide("danger", () => {
        resetPlayer();
      });

      player.onCollide("coin", (coin) => {
        k.play("score");
        k.destroy(coin);
        coinCount++;
        updateHUD();
      });

      k.onUpdate(() => {
        if (player.pos.y > vh + 200) resetPlayer();
        if (gameOverTriggered) return;
        elapsedTime += k.dt();
        levelProgress += k.dt();
        updateHUD();
      });

      k.loop(0.5, () => {
        if (
          levelProgress >= levelDuration &&
          level < maxLevel &&
          !gameOverTriggered
        ) {
          level++;
          currentEnemySpeed = enemySpeedByLevel[level];
          levelProgress = 0;
          updateHUD();
        }
      });

      const spawnEnemy = () => {
        if (gameOverTriggered) return;
        const [spawnX, spawnY] = platforms[0];
        const dir = Math.random() > 0.5 ? 1 : -1;
        const shouldSwitch = Math.random() < 0.5;
        const enemy_name = Math.floor(Math.random() * 5);
        const enemies = ["enemy", "enemy1", "enemy2", "enemy3", "enemy4"];

        k.add([
          k.sprite(enemies[enemy_name]),
          k.pos(spawnX, spawnY - 10),
          k.area(),
          k.body({ isSensor: true }),
          k.anchor("bot"),
          k.scale(0.2),
          "ai_enemy",
          "danger",
          {
            dir,
            currentStage: 0,
            switched: false,
            shouldSwitch,
          },
        ]);
      };

      k.onUpdate("ai_enemy", (enemy) => {
        if (gameOverTriggered) return;
        const state = enemy;
        const stageY = platforms[state.currentStage][1];

        if (
          enemy.pos.y > stageY + 20 &&
          state.currentStage < platforms.length - 1
        ) {
          state.currentStage++;

          if (
            state.currentStage === 1 &&
            state.shouldSwitch &&
            !state.switched
          ) {
            state.dir *= -1;
            state.switched = true;
          }
        }
        const extra_s = Math.floor(Math.random() * 5) * 2;
        enemy.move(state.dir * currentEnemySpeed + extra_s, 0);

        if (
          enemy.pos.x < -200 ||
          enemy.pos.x > vw + 200 ||
          enemy.pos.y > vh + 200
        ) {
          k.destroy(enemy);
        }
      });

      const spawnCoin = () => {
        if (gameOverTriggered) return;

        const randomPlatformIndex = Math.floor(
          Math.random() * platforms.length
        );
        const [xBase, y] = platforms[randomPlatformIndex];

        let random_pos_x;

        if (randomPlatformIndex === 0 || randomPlatformIndex === 3) {
          // Platformun merkezinden ±300 piksel içinde bir konum
          random_pos_x = xBase + Math.floor(Math.random() * 601) - 300;
        } else if (randomPlatformIndex === 1) {
          // Sağ platform – sadece sağ tarafta, sahne dışında da olabilir
          random_pos_x = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
        } else if (randomPlatformIndex === 2) {
          // Sol platform – sadece sol tarafta, sahne dışında da olabilir
          random_pos_x = Math.floor(Math.random() * (300 - 100 + 1)) * -1;
        }

        const coin = k.add([
          k.sprite("coin"),
          k.pos(random_pos_x, y - 110),
          k.area(),
          k.scale(0.15),
          "coin",
        ]);

        k.wait(5, () => {
          if (coin.exists()) k.destroy(coin);
        });
      };

      k.loop(spawnInterval, () => {
        if (Math.random() < 0.6) {
          spawnEnemy();
          spawnEnemy();
        } else {
          spawnEnemy();
          spawnEnemy();
          spawnEnemy();
        }
      });

      k.loop(1, () => {
        spawnCoin();
      });
    });
  }, []);

  return <canvas ref={canvasRef} className="game-container" />;
}
