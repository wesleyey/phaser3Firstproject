var game;
var gameOptions = {
  tileSize: 200,
  tileSpace: 20,
  boardSize: {
    rows: 4,
    cols: 4
  },
  tweenSpeed: 2000
};

const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

window.onload = function() {
  var gameConfig = {
    width:
      gameOptions.boardSize.cols *
        (gameOptions.tileSize + gameOptions.tileSpace) +
      gameOptions.tileSpace,
    height:
      gameOptions.boardSize.rows *
        (gameOptions.tileSize + gameOptions.tileSpace) +
      gameOptions.tileSpace,
    backgroundColor: 0xecf0f1,
    scene: [bootGame, playGame]
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resizeGame();
  window.addEventListener("resize", resizeGame);
};

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }
  preload() {
    this.load.image("emptytile", "assets/sprites/emptytile.png");
    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    });
  }
  create() {
    console.log("Loading...");
    this.scene.start("PlayGame");
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  create() {
    this.canMove = false;
    this.boardArray = [];
    console.log("This is my very first Phaser game");
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      this.boardArray[i] = [];
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
        var tile = this.add.sprite(
          tilePosition.x,
          tilePosition.y,
          "tiles",
          i + j
        );
        tile.visible = false;
        this.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile
        };
      }
    }
    this.addTile();
    this.addTile();
    this.input.keyboard.on("keydown", this.handleKey, this);
    this.input.on("pointerup", this.handleSwipe, this);
  }

  makeMove(d) {
    console.log("about to move");
  }

  handleKey(e) {
    if (this.canMove) {
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          this.makeMove(LEFT);
          break;
        case "KeyD":
        case "ArrowRight":
          this.makeMove(RIGHT);
          break;
        case "KeyW":
        case "ArrowUp":
          this.makeMove(UP);
          break;
        case "KeyS":
        case "ArrowDown":
          this.makeMove(DOWN);
          break;
      }
    }
    var keyPressed = e.code;
    console.log(`keycode : ${keyPressed}`);
  }

  handleSwipe(e) {
    var swipeTime = e.upTime - e.downTime;
    var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    console.log(`Movement time: ${swipeTime} ms`);
    console.log(`Horizontal distance: ${swipe.x} pixels`);
    console.log(`Vertical distance: ${swipe.y} pixels`);
  }

  getTilePosition(row, col) {
    var posX =
      gameOptions.tileSpace * (col + 1) + gameOptions.tileSize * (col + 0.5);
    var posY =
      gameOptions.tileSpace * (row + 1) + gameOptions.tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }

  addTile() {
    var emptyTiles = [];
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        if (this.boardArray[i][j].tileValue === 0) {
          emptyTiles.push({
            row: i,
            col: j
          });
        }
      }
    }
    if (emptyTiles.length > 0) {
      var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
      this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
      this.tweens.add({
        targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
        alpha: 1,
        duration: gameOptions.tweenSpeed,
        callbackScope: this,
        onComplete: function() {
          console.log("tween completed");
          this.canMove = true;
        }
      });
    }
  }
}

function resizeGame() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}
