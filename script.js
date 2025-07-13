class Game {
    constructor(canvas) {

        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height

        this.planet = new Planet(this)
        this.player = new Player(this)
        this.projectilePool = []
        this.numberOfProjectiles = 30
        this.createProjectilePool()
        this.enemyPool = []
        this.numberOfEnemies = 20
        this.createEnemyPool()
        this.enemyPool[0].start()
        this.enemyPool[1].start()
        this.enemyPool[2].start()
        this.enemyPool[3].start()
        this.enemyPool[4].start()

        this.debug = false

        this.mouse = {
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
        })

        window.addEventListener('mousedown', (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.player.shoot()
        })

        window.addEventListener('keyup', (e) => {
            if(e.key == 'd') this.debug = !this.debug
        })
    }

    /** 
     * @description This method will be called over & over for each animation frame
     * updating and redrawing our shapes and objects
     * @param context
     * */ 
    render(context) {
        this.planet.draw(context)
        this.player.draw(context)
        this.player.update()
        for(let projectile of this.projectilePool) {
            projectile.draw(context)
            projectile.update()
        }
         for(let enemy of this.enemyPool) {
            enemy.draw(context)
            enemy.update()
        }
    }

    /**
     * @description Calculates the a unit vector between 2 points
     * @param a point a 
     * @param b point b
     * @returns {}
     */
    calcAim(a, b) {
        /*
               a         
              /|         
        dist / |  dY         
            /  |        
            b__|
             dX
        */
        const dX = a.x - b.x
        const dY = a.y - b.y
        const distance = Math.hypot(dX, dY) 
        const aimX = -dX/distance
        const aimY = -dY/distance
        return [aimX, aimY, dX, dY ]
    }

    createProjectilePool() {
        for(let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilePool.push(new Projectile(this))
        }
    }

    getProjectile() {
        for(let i = 0; i < this.projectilePool.length; i++) {
            if(this.projectilePool[i].free) {
                return this.projectilePool[i]
            }
        }
    }

    createEnemyPool() {
        for(let i = 0; i < this.numberOfEnemies; i++) {
            this.enemyPool.push(new Enemy(this))
        }
    }

    getEnemy() {
        for(let i = 0; i < this.numberOfEnemies; i++) {
            if(this.enemyPool[i].free) {
                return this.enemyPool[i]
            }
        }
    }
}

class Planet{
    constructor(game) {
        this.game = game
        this.x = this.game.width * 0.5 // x-coordinate of planet on canvas
        this.y = this.game.height * 0.5 // y-coordinate of planet on canvas
        this.radius = 80 // radius of plant with origin as (200, 200)
        this.image = document.getElementById('planet');
    }

    /**
     * @param {context} The context on which we are drawing this object
     */
    draw(context) {
        context.drawImage(this.image, this.x-100, this.y-100)
         if(this.game.debug) {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI*2)
            context.stroke()
        }
    }
}

class Player{
    constructor(game) {
        this.game = game
        this.x = this.game.width * 0.5 // x-coordinate of player on canvas
        this.y = this.game.height * 0.5 // y-coordinate of player on canvas
        this.radius = 40
        this.image = document.getElementById('player')
        this.angle = Math.PI
        this.aim
    }

    draw(context) {
        context.save()
        context.translate(this.x, this.y) // shift canvas origin from (0,0) to (x,y)
        context.rotate(this.angle) // rotate the canvas at the new origin
        context.drawImage(this.image, - this.radius, - this.radius)
        if(this.game.debug) {
            context.beginPath()
            context.arc(0, 0, this.radius, 0, Math.PI*2)
            context.stroke()
        }
        context.restore()
    }

    update() {
        this.aim = this.game.calcAim(this.game.planet, this.game.mouse)
        this.x = this.game.planet.x + 100 * this.aim[0] 
        this.y = this.game.planet.y + 100 * this.aim[1]
        this.angle = Math.atan2(this.aim[3], this.aim[2])
    }

    shoot() {
        let projectile = this.game.getProjectile()
        if(projectile) {
            projectile.start(
                this.x + this.radius * this.aim[0], 
                this.y + this.radius * this.aim[1], 
                this.aim[0], 
                this.aim[1]
            )
        }
    }
}

class Projectile{
    constructor(game) {
        this.game = game;
        this.x = this.game.width * 0.5
        this.y = this.game.height * 0.5
        this.radius = 5
        this.speedX = 1
        this.speedY = 1
        this.free = true
        this.speedModifier = 4
    }

    start(x, y, speedX, speedY) {
        this.free = false
        this.x = x
        this.y = y
        this.speedX = speedX * this.speedModifier
        this.speedY = speedY * this.speedModifier
    }

    reset() {
        this.free = true
    }

    draw(context) {
        if(!this.free) {
            context.save()
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI*2)
            context.fillStyle = 'gold'
            context.fill()
            context.restore()
        }
    }

    update() {
        if(!this.free) {
            this.x += this.speedX
            this.y += this.speedY
        }
        if(this.x < 0 || this.x > this.game.width || this.y < 0 || this.y > this.game.height) {
            this.reset()
        }
    }
}

class Enemy{
    constructor(game) {
        this.game = game
        this.x = 100
        this.y = 100
        this.radius = 40
        this.width = this.radius * 2
        this.height = this.radius * 2

        // These will determine in which direction the enemy will move
        this.speedX = 0
        this.speedY = 0

        this.free = true
    }

    start() {
        this.free = false
        this.x = Math.random() * this.game.width
        this.y = Math.random() * this.game.height
        const aim = this.game.calcAim(this, this.game.planet)
        this.speedX = aim[0]
        this.speedY = aim[1]
    }

    reset() {
        this.free = true
    }

    draw(context) {
        if(!this.free) {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            context.stroke()
        }
    }

    update() {
        if(!this.free) {
            this.x += this.speedX
            this.y += this.speedY
        }
    }
 }

// We want to wait till all our assets are loaded before js kicks in
// So we are putting all our code in an event listener
window.addEventListener('load', () => {

    // Canvas is like the page we are drawing on
    const canvas = document.getElementById('canvas1')
    canvas.width = 800;
    canvas.height = 800;

    // context is the paint brush we are using to draw
    const context = canvas.getContext('2d');
    context.strokeStyle = 'white';
    context.lineWidth = 2;

    const game = new Game(canvas)
    
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        game.render(context)
        requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
})