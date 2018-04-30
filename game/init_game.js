(function() {
    var platforms, player, playerstand, cursors, mummy, ground, music, back, gg;
    var bullets = [];
    var mission = {
        src: 'assets/img/backMission1.png',
        width: 4153,
        height: 336
    };
    var config = {
        width: 500,
        height: 336
    };
    var game = new Phaser.Game(config.width, mission.height, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
    console.log(game);
    function preload() {
        //game.load.tilemap('map', 'assets/mission-1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('mission1', mission.src);
        game.load.image('ground', 'assets/img/platform2.png');
        game.load.image('bullet', 'assets/img/bullet.gif');
        game.load.image('backIMG', 'assets/img/back2plan/backcenter.png');
        game.load.image('backtrees', 'assets/img/back2plan/backtrees.png');
        game.load.image('sky', 'assets/img/back2plan/sky.png');
        game.load.image('boatSide', 'assets/img/destructible/boatside.png');
        game.load.image('rock', 'assets/img/destructible/rock.png');
        game.load.image('BossM1', 'assets/img/Boss/IdleBoss.png');
        game.load.spritesheet('bkgAbondonBoat', 'assets/img/animBkg/bkgAbondonBoat5.png', 316, 230, 8);
        game.load.spritesheet('middleWater', 'assets/img/animBkg/middleWater2.png', 901, 48, 8);
        game.load.spritesheet('rightWater', 'assets/img/animBkg/rightWater2.png', 605, 48, 8);
        game.load.spritesheet('water', 'assets/img/animBkg/water.png', 605, 32, 8);
        game.load.spritesheet('waterFall', 'assets/img/animBkg/waterFall.png', 430, 272, 8);
        game.load.spritesheet('waterFall2', 'assets/img/animBkg/waterFall2.png', 832, 304, 8);
        game.load.spritesheet('bkgBoss', 'assets/img/animBkg/sceenBoss.png', 277, 192, 8);
        game.load.spritesheet('MARCO', 'assets/img/marco/bust/marcostand.png', 47, 28, 6);
        game.load.spritesheet('SS', 'assets/img/allLegs.png', 25.10, 23, 39);
        game.load.atlasXML('marco', 'assets/img/marco copie.png', 'assets/marco.xml');
        game.load.spritesheet('mummy', 'assets/img/mummy.png', 37, 45, 18);
        game.load.audio('stage1', ['assets/sounds/music/stage1.mp3']);
        game.load.audio('machineGun', ['assets/sounds/gun/pistol.mp3']);
    }

    function createLedges() {
        LEDGES.forEach(function(l){
            var ledge = platforms.create(l.x, l.y + 110, 'ground');
            ledge.body.immovable = true;
            ledge.width = l.width;
            //ledge.alpha = 0;
        });
    }
    function mission1 () {
        music = game.add.audio('stage1');
        //music.play();
        game.world.setBounds(0, mission.height - 30, mission.width, config.height);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, mission.height, 'mission1');
        platforms = game.add.group();
        platforms.enableBody = true;
        GROUNDS.forEach(function(l){
            ground = platforms.create(l.x, l.y + 320, 'ground');
            ground.body.immovable = true;
            ground.width = l.width;
            ground.scale.setTo(l.width/10, 1);
            console.log(l.width);
            //ground.alpha = 0;
        });
        //ground = platforms.create(0, game.world.height - 20, 'ground');

        ground.body.immovable = true;
    }
    function create() {
        /**
         * back
         */
        backTrees();
        bkgAbondonBoat();
        backImg();

        mission1();
        bkgBoss();
        bossMission1();
        waterFall();
        rigthWater();
        waterFall2();
        middleWater();
        createLedges();
        createMummy();
        rock();
        marco();
        /**
         * first
         */
        boatSide();
        cursors = createCursors();
    }

    function createCursors() {
        var c = game.input.keyboard.createCursorKeys();
        c.jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        c.fire = game.input.keyboard.addKey(Phaser.Keyboard.D);
        return c;
    }
    function update() {

        game.physics.arcade.collide(player, platforms);
        player.body.checkCollision.up = false;
        player.body.checkCollision.left = false;
        player.body.checkCollision.right = false;
        player.body.checkCollision.down = true;
        player.body.immovable = false;
        game.physics.arcade.collide(mummy, player);

        player.body.velocity.x = 0;

        updateBullets();

        shifting();

    }
    function shifting() {
        var now = new Date().getTime();
        var nowSecond = new Date().getSeconds();
        var lastBullet = bullets[bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + 80 : 0;
        var canFire = lastDate < now;
        if (cursors.fire.isDown && canFire) {
            var x, sprite, y, direction;
            var date = new Date().getTime();

            if (cursors.up.isDown) {
                x = (player.width / 1.5) + player.position.x ;
                y = player.position.y;
                direction = 'up';
                music = game.add.audio('machineGun');
                //music.play();
            } else if (cursors.down.isDown) {
                x = (player.width / 1.5) + player.position.x;
                y = player.position.y;
                direction = 'down';
                music = game.add.audio('machineGun');
                //music.play();
            } else {
                x = player.width + player.position.x;
                y = (player.height / 2) + player.position.y;
                direction = player.scale.x === 1 ? 'right' : 'left';
                music = game.add.audio('machineGun');
                //music.play();
            }

            sprite = game.add.sprite(x, y, 'bullet');

            //console.log(playerstand.position);
            console.log(sprite.scale)
            if (direction === 'left') {
                sprite.scale.x = -1;
            } else if (direction === 'up') {
                sprite.rotation = 4.7;
            } else if (direction === 'down') {
                sprite.scale.y = -1;
            }

            bullets.push({
                direction: direction,
                sprite: sprite,
                date: date
            });
        }

        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
        if (nowSecond >= 20) {
            playerstand.animations.play('stand');
        }
        if (cursors.left.isDown) {
            //left
            if (player.scale.x != -1) {
                player.scale.x = -1;
            }
            player.body.velocity.x = -100;
            player.animations.play('walk');
            playerstand.animations.stop();
            playerstand.frame = 0;
        } else if (cursors.right.isDown) {
            //right
            if (player.scale.x != 1) {
                player.scale.x = 1;
            }
            player.body.velocity.x = 100;
            player.animations.play('walk');
            playerstand.animations.stop();
            playerstand.frame = 0;
        } else if (cursors.up.isDown) {
            if (player.animations.currentFrame.index === 10) {
                player.animations.stop('lookingUp');
            } else {
                player.animations.play('lookingUp');
            }
            playerstand.animations.stop();
            playerstand.frame = 0;
        } else if (cursors.down.isDown) {
            if (player.scale.y != 1) {
                player.scale.y = -1;
            }

            playerstand.animations.stop();
            playerstand.frame = 0;
        } else {
            player.animations.stop();
            player.frame = 7;

        }
        if (cursors.jump.isDown || player.body.touching.down === false) {
            player.frame = 5;
        }
        if (cursors.jump.isDown && player.body.touching.down) {
            player.body.velocity.y = -300;
        }
    }
    function updateBullets() {
        var position;
        var speed = 10;

        bullets.forEach(function(bullet) {
            if (bullet.direction === 'up') {
                bullet.sprite.y -= speed;
            } else {
                position = bullet.direction === 'right' ? speed : -speed;
                bullet.sprite.position.x += position;
            }
        });
    }

    function marco() {
        player = game.add.sprite(3800, game.world.height - 300, 'marco');
        playerstand = game.add.sprite(1230, game.world.height - 100, 'MARCO');
        //game.camera.follow(player);
        game.physics.arcade.enable(player);
        player.body.bounce.y = .15;
        player.body.gravity.y = 790;
        player.body.collideWorldBounds = false;
       //Animations
        player.animations.add('walk', [0,1,2,3,4,5,6,7], 12);
        playerstand.animations.add('stand', [0,1,2,3,4,5,4,3,2,1], 8);
        player.animations.add('lookingUp', [13,12,11,10,11,12,13], 30, false);
    }
    function createMummy() {
        MUMMYS.forEach(function(l){
            var mummy = game.add.sprite(l.x, l.y + 340, 'mummy');
            mummy.animations.add('walk');
            mummy.animations.play('walk', 10, true);
            game.physics.arcade.enable(mummy);
        });
    }
    function backImg() {
        game.add.sprite(2350, game.world.height + 43.8, 'backIMG');
    }
    function backTrees() {
        game.add.sprite(-210, game.world.height + 83, 'sky');
        game.add.sprite(110, game.world.height + 83, 'sky');
        game.add.sprite(430, game.world.height + 83, 'sky');
        game.add.sprite(750, game.world.height + 83, 'sky');
        game.add.sprite(1070, game.world.height + 83, 'sky');
        game.add.sprite(1390, game.world.height + 83, 'sky');
        game.add.sprite(1710, game.world.height + 83, 'backtrees');
        game.add.sprite(2030, game.world.height + 83, 'backtrees');
    }
    function boatSide() {
        game.add.sprite(1360, game.world.height + 205, 'boatSide');
    }
    function rock() {
        var rock = game.add.sprite(560, game.world.height + 210, 'rock');
    }
    function bkgAbondonBoat() {
        var bkgBoat = game.add.sprite(3085, game.world.height - 50, 'bkgAbondonBoat');
        bkgBoat.animations.add('walk', [5,1,2,3,4,5,6,7]);
        bkgBoat.animations.play('walk', 10, true);
        bkgBoat.scale.setTo(1.5,1.5);
    }
    function middleWater() {
        //game.add.sprite(1750, game.world.height - 100, 'marco');
        var middleWater = game.add.sprite(1860, game.world.height + 259, 'middleWater');
        middleWater.animations.add('walk', [0,1,2,3,4,5,6,7]);
        middleWater.animations.play('walk', 30, true);
    }
    function rigthWater() {
        var rigthWater = game.add.sprite(2761, game.world.height + 274, 'water');
        rigthWater.animations.add('walk', [0,1,2,3,4,5,6,7]);
        rigthWater.animations.play('walk', 30, true);
    }
    function waterFall() {
        var waterfall = game.add.sprite(3335, game.world.height, 'waterFall');
        waterfall.animations.add('walk', [0,1,2,3,4,5,6,7]);
        waterfall.animations.play('walk', 30, true);
    }
    function waterFall2() {
        var waterfall2 = game.add.sprite(3319, game.world.height, 'waterFall2');
        waterfall2.animations.add('walk', [0,2,2,3,4,4,6,7]);
        waterfall2.animations.play('walk', 30, true);
    }
    function bkgBoss() {
        var waterfall2 = game.add.sprite(game.world.width - 400, game.world.height - 45, 'bkgBoss');
        waterfall2.animations.add('walk', [0,2,2,3,4,4,6,7]);
        waterfall2.animations.play('walk', 30, true);
        waterfall2.scale.setTo(1.5,1);
    }
    function bossMission1() {
        game.add.sprite(game.world.width - 399, game.world.height - 46, 'BossM1');
    }




    function render() {

        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.spriteCoords(player, 100, 100);

    }
    this.game = game;

}).call(App);