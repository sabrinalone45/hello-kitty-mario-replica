// hello kitty mario replica game using javascript

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100 // Adjusted the y position to align with the top of the platform
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.width = 90; // Decreased width to make the player smaller
    this.height = 100;

    this.image = rightstandImage;
    this.frameCounter = 0; 
    this.frameDelay = 12; 
    this.frames = 0;
    this.sprites = {
      stand: {
        right: rightstandImage,
        left: leftstandImage,
        cropWidth: 278,
        cropHeight: 320
      },
      run: {
        right: rightrunImage,
        left: leftrunImage,
        cropWidth: 300.4,
        cropHeight: 400
      }
    }

    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 278
    this.currentCropHeight = 320
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      this.currentCropHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frameCounter++;
    
    if (this.frameCounter >= this.frameDelay) {
      this.frames++;
      if (this.frames > 3 && (this.currentSprite === this.sprites.stand.right || 
        this.currentSprite === this.sprites.stand.left)) 
      this.frames = 0;
      this.frameCounter = 0; 
    } else if (this.frames > 23 && (this.currentSprite === this.sprites.run.right
      || this.currentSprite === this.sprites.run.left))
      this.frames = 0;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y: 470
    };
    this.width = 820;
    this.height = 150;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}
class GrassPlatform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    };
    this.width = 280;
    this.height = 240;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    };
    this.width = 9000;
    this.height = 576;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImage = createImage('./img/grassplatform.jpg');
let backgroundImage = createImage('./img/backgroundd.jpg');
let hillsImage = createImage('./img/pinkhills.png');
let grassImage = createImage('./img/grassyay.png');
let rightrunImage = createImage('./img/spritekittyright.png')
let leftrunImage = createImage('./img/spritekittyleft.png')
let leftstandImage = createImage('./img/standleft.png')
let rightstandImage = createImage('./img/standright.png')

let player = new Player();
let platforms = [];
let genericObjects = [];

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
};

let scrollOffset = 0;

function init() {
  platformImage = createImage('./img/grassplatform.jpg');
  backgroundImage = createImage('./img/backgroundd.jpg');
  hillsImage = createImage('./img/pinkhills.png');
  grassImage = createImage('./img/grassyay.png');
  rightrunImage = createImage('./img/spritekittyright.png')
  leftrunImage = createImage('./img/spritekittyleft.png')
  leftstandImage = createImage('./img/standleft.png')
  rightstandImage = createImage('./img/standright.png')

  player = new Player();
  platforms = [
    new Platform({ x: -1, y: 410, image: platformImage }),
    new Platform({ x: 796, y: 410, image: platformImage }),
    new Platform({ x: 1740, y: 410, image: platformImage }),
    new Platform({ x: 2750, y: 410, image: platformImage }),
    new Platform({ x: 3450, y: 410, image: platformImage }),
    new Platform({ x: 4950, y: 410, image: platformImage }),
    new Platform({ x: 5450, y: 410, image: platformImage }),
    new Platform({ x: 6450, y: 410, image: platformImage }),
    new GrassPlatform({ x: 3050, y: 200, image: grassImage }),
    new GrassPlatform({ x: 2650, y: 300, image: grassImage }),
    new GrassPlatform({ x: 4250, y: 300, image: grassImage }),
    new GrassPlatform({ x: 4550, y: 190, image: grassImage }),
    new GrassPlatform({ x: 4850, y: 300, image: grassImage }),
  ];


  genericObjects = [
    new GenericObject({
      x: -1,
      y: 100,
      image: grassImage
    }),
    new GenericObject({
      x: -1,
      y: 0,
      image: backgroundImage
    }),
    new GenericObject({
      x: -1,
      y: 15,
      image: hillsImage
    })
  ];

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach(genericObject => {
    genericObject.draw();
  });

  player.update();
  platforms.forEach(platform => {
    platform.draw();
  });

  if (keys.right.pressed && player.position.x < 600) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100)
  || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  platforms.forEach((platform) => {
    if (player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
      platform.position.y && player.position.x + player.width >=
      platform.position.x && player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (scrollOffset > 6450) {
    console.log('you win');
  }

  if (player.position.y > canvas.height)
    init();
}

init();
animate();

window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'a':
      keys.left.pressed = true;
      player.currentSprite = player.sprites.run.left
      player.currentCropWidth = player.sprites.run.cropWidth
      player.currentCropHeight = player.sprites.run.cropHeight
      break;
    case 'd':
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right
      player.currentCropWidth = player.sprites.run.cropWidth
      player.currentCropHeight = player.sprites.run.cropHeight
      break;
    case 'w':
      player.velocity.y -= 25;
      break;
  }
});

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left
      player.currentCropWidth = player.sprites.stand.cropWidth
      player.currentCropHeight = player.sprites.stand.cropHeight
      break;
    case 'd':
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right
      player.currentCropWidth = player.sprites.stand.cropWidth
      player.currentCropHeight = player.sprites.stand.cropHeight
      break;
    case 'w':
      break;
  }
});