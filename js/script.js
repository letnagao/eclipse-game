const $ = (tag) => document.querySelector(tag)

const cnv = $('canvas')
    cnv.width = innerWidth
    cnv.height = innerHeight
const ctx = cnv.getContext('2d')
const player = new Player(cnv.width / 2, cnv.height / 2, 30, '#48FCFF')
const shootingSpeed = 4

let projectiles = []
let enemies = []
let intervalID 

function spawnEnemies() {
    intervalID = setInterval(() => {
        const radius = Math.floor(Math.random() * 26) + 5

        let posX, posY
        if(Math.random() < .5) {
            posX = Math.random() < .5 ? 0 - radius : cnv.width + radius
            posY = Math.random() * cnv.height
        } else {
            posX = Math.random() * cnv.width
            posY = Math.random() < .5 ? 0 - radius : cnv.height + radius
        }

        const angle = Math.atan2(player.y - posY, player.x - posX)

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        const color = 'hsl('+ Math.random() * 360 +',50%,50%)'

        enemies.push(new Enemy(posX,posY,radius,color,velocity))
    },1500)
}

cnv.addEventListener('click', (e) => {
    e.preventDefault()
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x)
    const velocity = {
        x: Math.cos(angle) * shootingSpeed,
        y: Math.sin(angle) * shootingSpeed
    }
    projectiles.push(new Projectile(player.x, player.y, 3, '#48FCFF', velocity))
})

function loop() {
    requestAnimationFrame(loop, cnv)
    update()
}

function update() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)'
    ctx.fillRect(0, 0, cnv.width, cnv.height)

    checkEnemies()
    checkProjectiles()
    player.update()
}

function checkEnemies() {
    enemies.forEach((enemy) => {
        enemy.update()
    }) 
}

function checkProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i]
        p.update()
        checkOffScreen(p,i)
    }
}

function checkOffScreen(projectile, index) {
    if (projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > cnv.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > cnv.height) 
    {
        projectile.splice(index, 1)
    }
}

loop()
spawnEnemies()