







// Ініціалізація


var config = {


    type: Phaser.AUTO,
    width: 1000,
    height: 500,






    scene: {
        physics: {  


            default: 'arcade',


            arcade: {
                debug: false
            }
        },
        preload: preload,
        create: create,
        update: update


    }
};








var game = new Phaser.Game(config);


var trash;
var spaceship;
var isAccelerating = false;
var canMove = true;












function preload() {


    this.load.image('smalltrash', 'assets/smalltrash.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('spaceship', 'assets/spaceship1.png');
    this.load.image('bigtrash', 'assets/bigtrash.png');
    this.load.image('clean', 'assets/clean.png');


}




function create() {
    // фон
    this.add.image(0, 0, 'sky').setOrigin(0);






   
    this.spaceship = this.physics.add.sprite(375, 351, 'spaceship').setScale(0.3);
    this.spaceship.setCollideWorldBounds(true);






    // збір сміття
    this.physics.add.collider(this.spaceship, this.bigtrash, collectBigTrash, null, this);


    // додавання  сміття
    this.bigtrash = this.physics.add.group();


    this.physics.add.collider(this.spaceship, this.bigtrash, collectSmallTrash, null, this);










    this.physics.add.collider(this.spaceship, this.clean, function (spaceship, clean) {
       
        clean.setBounce(1);
        spaceship.setBounce(1);


       
        var angle = Phaser.Math.Angle.Between(clean.x, clean.y, spaceship.x, spaceship.y);
        var velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(300);


       
        clean.setVelocity(velocity.x, velocity.y);
        spaceship.setVelocity(-velocity.x, -velocity.y);
    }, null, this);
















    // Рахунок


    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Рахунок: 0', { fontSize: '32px', fill: '#fff' });


    //  час


    this.timeText = this.add.text(800, 16, 'Час: 100', { fontSize: '32px', fill: '#fff' });
   
    this.timer = this.time.addEvent({ delay: 1000, callback: updateTimer, callbackScope: this, repeat: 99 });








if (this.score < 0) {
       
    this.add.text(400, 250, 'ВИ НЕ ВПОРАЛИСЬ!', { fontSize: '64px', fill: '#fff' }); //  повідомлення Game Over
    this.physics.pause();
    this.timer.paused = true;
}




// додавання сміття
this.time.addEvent({
    delay: 2200,
    loop: true,
    callback: function () {
        var side = Phaser.Math.Between(0, 3);
        var x;
        var y;


        if (side === 0) {


            x = 0;
            y = Phaser.Math.Between(0, game.config.height);


        } else if (side === 1) {


            x = Phaser.Math.Between(0, game.config.width);
            y = 0;


        } else if (side === 2) {


            x = game.config.width;
            y = Phaser.Math.Between(0, game.config.height);


        } else {


            x = Phaser.Math.Between(0, game.config.width);
            y = game.config.height;
        }


        var bigtrash = this.bigtrash.create(x, y, 'smalltrash');
        this.physics.moveToObject(bigtrash, this.spaceship, 200);
 
    },


    callbackScope: this


});


    // додавання клінів
    this.clean = this.physics.add.group();


    this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: function () {
            var side = Phaser.Math.Between(0, 3);
            var x;
            var y;


            if (side === 0) {
                x = 0;
                y = Phaser.Math.Between(0, game.config.height);
            } else if (side === 1) {
                x = Phaser.Math.Between(0, game.config.width);
                y = 0;
            } else if (side === 2) {
                x = game.config.width;
                y = Phaser.Math.Between(0, game.config.height);
            } else {
                x = Phaser.Math.Between(0, game.config.width);
                y = game.config.height;
            }


            var clean = this.clean.create(x, y, 'clean');
            this.physics.moveToObject(clean, this.spaceship, 200);
        },
        callbackScope: this
    });


    // додавання колізії з кораблем
    this.physics.add.collider(this.spaceship, this.clean, shipHit, null, this);


 


// додавання сміття
this.time.addEvent({
    delay: 1100,
    loop: true,
    callback: function () {
        var side = Phaser.Math.Between(0, 3);
        var x;
        var y;


        if (side === 0) {
            x = 0;
            y = Phaser.Math.Between(0, game.config.height);
        } else if (side === 1) {
            x = Phaser.Math.Between(0, game.config.width);
            y = 0;
        } else if (side === 2) {
            x = game.config.width;
            y = Phaser.Math.Between(0, game.config.height);
        } else {
            x = Phaser.Math.Between(0, game.config.width);
            y = game.config.height;
        }


        var bigtrash = this.bigtrash.create(x, y, 'bigtrash');
        this.physics.moveToObject(bigtrash, this.spaceship, 200);
 
    },
    callbackScope: this
});








}






//  оновлення


function update() {
   
    if (this.input.activePointer.isDown) {


        var angle = Phaser.Math.Angle.Between(this.spaceship.x, this.spaceship.y, this.input.x, this.input.y);
       
        this.spaceship.setRotation(angle);
       


        if (isAccelerating) {
            this.physics.moveTo(this.spaceship, this.input.x, this.input.y, 400);
        } else {
            this.physics.moveTo(this.spaceship, this.input.x, this.input.y, 200);
        }


    }






    // видалення сміття
    this.bigtrash.children.iterate(function (child) {
        if (child.x < -50) {
            child.x = 1100;
        }
    });


   
}


//  збор сміття
function collectBigTrash(spaceship, trash) {
    bigtrash.disableBody(true, true);
    this.score += 5;
    this.scoreText.setText('Рахунок: ' + this.score);


   
    checkScore.call(this);
}




function collectSmallTrash(spaceship, smalltrash) {
    smalltrash.disableBody(true, true);
    this.score += 10; //
    this.scoreText.setText('Рахунок: ' + this.score);
   
}




// Функція оновлення таймера
function updateTimer() {
    this.timeText.setText('Час: ' + this.timer.repeatCount);
}


// Функція завершення гри
function gameOver() {
    this.add.text(400, 290, 'ВИ НЕ ВПОРАЛИСЬ', { fontSize: '64px', fill: '#fff' });
    this.physics.pause();
    this.timer.paused = true;
   
    setTimeout(() => {
        location.reload(); // Оновлення сторінки через 3 секунд
    }, 3000);
}


// Реакція на зіткнення корабля з лазерами
function shipHit(spaceship, clean) {
    this.score -= 10;
    this.scoreText.setText('Рахунок: ' + this.score);




   


    if (this.score < 0) {
       
        this.add.text(400, 250, 'ВИ НЕ ВПОРАЛИСЬ', { fontSize: '64px', fill: '#fff' }); // Виведення повідомлення "Game Over"
        this.physics.pause(); // Призупинення фізики гри
        this.timer.paused = true; // Призупинення таймера
        canMove = false;
       
    }


    clean.destroy();


}



