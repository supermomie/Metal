(function() {
    var platforms, player, cursors, mummy, ground, music;
    var bullets = [];
    var mission = {
        src: 'assets/img/backMission1.png',
        width: 4088,
        height: 300
    };
    var config = {
        width: 300,
        height: 600
    };
    var game = new Phaser.Game(config.width, mission.height, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });
    function preload() {
        //game.load.tilemap('map', 'assets/mission-1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('mission1', mission.src);
        game.load.image('ground', 'assets/img/platform2.png');
        game.load.image('bullet', 'assets/img/bullet.gif');
        game.load.atlasXML('marco', 'assets/img/marco.png', 'assets/marco.xml');
        game.load.spritesheet('mummy', 'assets/img/mummy.png', 37, 45, 18);
        game.load.audio('stage1', ['assets/sounds/music/stage1.mp3']);
        game.load.audio('machineGun', ['assets/sounds/gun/pistol.mp3']);
    }

    function createLedges() {
        LEDGES.forEach(function(l){
            var ledge = platforms.create(l.x, l.y, 'ground');
            ledge.body.immovable = true;
            ledge.width = l.width;
            //ledge.alpha = 0;
        });
    }
    function mission1 () {
        music = game.add.audio('stage1');
        //music.play();


        game.world.setBounds(0, 0, mission.width, config.height);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 227, 'mission1');

        platforms = game.add.group();
        platforms.enableBody = true;


        ground = platforms.create(0, game.world.height - 90, 'ground');
        ground.scale.setTo(10, 0);
        ground.body.immovable = true;
    }
    function create() {
        //game.add.text(32, 32, "this text is on the background\nuse arrows to scroll", { font: "32px Arial", fill: "#f26c4f", align: "left" });
        mission1();
        createLedges();
        marco();
        createMummy();
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
        player.body.checkCollision.down = true;

        game.physics.arcade.collide(mummy, player, true);

        player.body.velocity.x = 0;

        updateBullets();

        shifting();
    }

    function shifting() {
        var now = new Date().getTime();
        var lastBullet = bullets[bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + 90 : 0;
        var canFire = lastDate < now;
        if (cursors.fire.isDown && canFire) {
            var x, sprite, y, direction;
            var date = new Date().getTime();

            if (cursors.up.isDown) {
                x = (player.width / 1.5) + player.position.x ;
                y = player.position.y;
                direction = 'up';
                music = game.add.audio('machineGun');
                music.play();
                console.log("up")
            } else if (cursors.down.isDown) {
                x = (player.width / 1.5) + player.position.x;
                y = player.position.y;
                direction = 'down';
                music = game.add.audio('machineGun');
                music.play();
            } else {
                x = player.width + player.position.x;
                y = (player.height / 2) + player.position.y;
                direction = player.scale.x === 1 ? 'right' : 'left';
                music = game.add.audio('machineGun');
                music.play();
                console.log("side")
            }

            sprite = game.add.sprite(x, y, 'bullet');

            if (direction === 'left') {
                sprite.scale.x = -1;
            } else if (direction === 'up') {
                sprite.rotation = 4.7;
            } else if (direction === 'down') {
                sprite.rotation = -4.7;
            } else if (direction === 'rigth' && direction === 'up') {
                sprite.rotation = -2;
            }

            bullets.push({
                direction: direction,
                sprite: sprite,
                date: date
            });
        }
        if (cursors.left.isDown) {
            //left
            if (player.scale.x != -1) {
                player.scale.x = -1;
            }
            player.body.velocity.x = -100;
            player.animations.play('walk');
            //mummy.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            //right
            if (player.scale.x != 1) {
                player.scale.x = 1;
            }
            player.body.velocity.x = 100;
            player.animations.play('walk');
            //mummy.animations.play('walk');
        } else if (cursors.up.isDown) {
            if (player.animations.currentFrame.index === 10) {
                player.animations.stop('lookingUp');
            } else {
                player.animations.play('lookingUp');
            }
        } else if (cursors.down.isDown) {
            console.log("down")
        } else {
            player.animations.stop();
            player.frame = 7;
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
        player = game.add.sprite(150, game.world.height - 300, 'marco');

        game.camera.follow(player);
        game.physics.arcade.enable(player);
        player.body.bounce.y = .15;
        player.body.gravity.y = 800;
        player.body.collideWorldBounds = false;
       //Animations
        player.animations.add('walk', [0,1,2,3,4,5,6,7,8,9], 10);
        player.animations.add('lookingUp', [13,12,11,10], 10, false);
    }

    function createMummy() {
        MUMMYS.forEach(function(l){
            var mummy = game.add.sprite(l.x, game.world.height - l.y, 'mummy');
            mummy.animations.add('walk');
            mummy.animations.play('walk', 10, true);
        });
    }


    function render() {

        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.spriteCoords(player, 100, 100);

    }

    this.game = game;

}).call(App);