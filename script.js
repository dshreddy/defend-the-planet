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
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        context.stroke()
    }
}

class Player{
    constructor(game) {
        this.game = game
        this.x = this.game.width * 0.5 // x-coordinate of planet on canvas
        this.y = this.game.height * 0.5 // y-coordinate of planet on canvas
        this.radius = 40
        this.image = document.getElementById('player')
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y)
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        context.stroke()
    }

    update() {
        this.x++
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.planet = new Planet(this)
        this.player = new Player(this)

        this.mouse = {
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
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
        context.beginPath()
        context.moveTo(this.planet.x, this.planet.y)
        context.lineTo(this.mouse.x, this.mouse.y)
        context.stroke()
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