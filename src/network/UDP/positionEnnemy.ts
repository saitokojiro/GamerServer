

const MONSTERS_PER_ZONE = 50;
const ZONES = 6;
const TICK_RATE = 100;
const monsters: any = [];

function moveMonster(monster) {
    const directions = [
        { x: 1, y: 0 },  // droite
        { x: -1, y: 0 }, // gauche
        { x: 0, y: 1 },  // bas
        { x: 0, y: -1 }  // haut
    ];

    const dir = directions[Math.floor(Math.random() * directions.length)];
    monster.x += dir.x;
    monster.y += dir.y;

    // Limites de la zone (par exemple, une grille de 100x100)
    if (monster.x < 0) monster.x = 0;
    if (monster.x > 100) monster.x = 100;
    if (monster.y < 0) monster.y = 0;
    if (monster.y > 100) monster.y = 100;
}

// Fonction principale pour actualiser et envoyer les positions
/*function updateMonstersPositions() {
    for (let z = 0; z < ZONES; z++) {
        for (let monster of monsters[z]) {
            moveMonster(monster);
        }
    }

    broadcastMonstersPositions();
}*/

// Fonction pour envoyer les positions à tous les clients
function broadcastMonstersPositions(socket: any, USocket: Map<string, any>) {
    const data = JSON.stringify(monsters);

    // Envoie des données aux clients
    // Remarque: tu devras modifier cela pour qu'il s'agisse des adresses IP et des ports des clients
    USocket.forEach((el, key) => {
        socket.send(data, 0, data.length, el.port, el.addr, (err) => {
            if (err) console.log('Erreur lors de l\'envoi des données : ', err);
        });
    })

}

export let positionEnnemy = (socket: any, message: any, USocket: Map<string, any>) => {
    for (let z = 0; z < ZONES; z++) {
        for (let monster of monsters[z]) {
            moveMonster(monster);
        }
    }

    broadcastMonstersPositions(socket, USocket);
}