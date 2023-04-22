let bestAntIndex;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let listOfPoints = [2];
listOfPoints[0] = []; //x
listOfPoints[1] = []; //y


function ants(graph) { 
        const numNodes = graph.length;
        const numAnts = 10;
        const iterationLimit = 100;
        const alpha = 1;
        const beta = 1;
        const evaporationRate = 0.5;
        const initialPheromone = 0.1;

        let iteration = 0;
        let ants = [];
        let pheromone = [];
        for (let i = 0; i < numAnts; i++) {
            ants.push({
                path: [],
                visited: [],
                totalDistance: 0
            });
        }
        for (let i = 0; i < numNodes; i++) {
            pheromone[i] = [];
            for (let j = 0; j < numNodes; j++) {
                pheromone[i][j] = initialPheromone;
            }
        }

        for (; iteration < iterationLimit; iteration++) {
            for (let i = 0; i < numAnts; i++) {
                const ant = ants[i];
                ant.visited = new Array(numNodes).fill(false);
                ant.path = [Math.floor(Math.random() * numNodes)];
                ant.visited[ant.path[0]] = true;
                ant.totalDistance = 0;
                for (let j = 1; j < numNodes; j++) {
                    const currentNode = ant.path[j-1];
                    const probabilities = [];
                    let denominator = 0;
                    for (let k = 0; k < numNodes; k++) {
                        if (!ant.visited[k]) {
                            const numerator = Math.pow(pheromone[currentNode][k], alpha) * Math.pow(1/graph[currentNode][k], beta);
                            denominator += numerator;
                            probabilities[k] = numerator;
                        }
                    }
                    let cumulativeProbability = 0;
                    let selectedIndex = -1;
                    const randomValue = Math.random() * denominator;
                    for (let k = 0; k < numNodes; k++) {
                        if (!ant.visited[k]) {
                            cumulativeProbability += probabilities[k];
                            if (cumulativeProbability >= randomValue) {
                                selectedIndex = k;
                                break;
                            }
                        }
                    }
                    ant.path.push(selectedIndex);
                    ant.visited[selectedIndex] = true;
                    ant.totalDistance += graph[currentNode][selectedIndex];
                }
            }
            for (let i = 0; i < numNodes; i++) {
                for (let j = 0; j < numNodes; j++) {
                    pheromone[i][j] = pheromone[i][j] * (1 - evaporationRate);
                }
            }
            bestAntIndex = 0;
            let bestDistance = ants[0].totalDistance;
            for (let i = 1; i < numAnts; i++) {
            if (ants[i].totalDistance < bestDistance) {
                bestAntIndex = i;
                bestDistance = ants[i].totalDistance;
            }
            }
            const bestAnt = ants[bestAntIndex];
            for (let i = 1; i < numNodes; i++) {
                const fromNode = bestAnt.path[i-1];
                const toNode = bestAnt.path[i];
                pheromone[fromNode][toNode] += initialPheromone/bestDistance;
                pheromone[toNode][fromNode] += initialPheromone/bestDistance;
            }

        }
        const bestAnt = ants[bestAntIndex];
        const bestPath = bestAnt.path;
        console.log('Best path found:', bestPath);
        let distance = 0;
        for (let i = 1; i < numNodes; i++) {
            distance += graph[bestPath[i-1]][bestPath[i]];
        }
        console.log('Distance:', distance);
        for (let i = 1; i < bestPath.length; i++) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(listOfPoints[0][bestPath[i - 1]], listOfPoints[1][bestPath[i - 1]]);
            ctx.lineTo(listOfPoints[0][bestPath[i]], listOfPoints[1][bestPath[i]]);
            ctx.stroke();
        }
            ctx.beginPath();
            ctx.moveTo(listOfPoints[0][bestPath[bestPath.length - 1]], listOfPoints[1][bestPath[bestPath.length - 1]]);
            ctx.lineTo(listOfPoints[0][bestPath[0]], listOfPoints[1][bestPath[0]]);
            ctx.stroke();
}   

function createPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2*Math.PI);
    ctx.fill();
    }
    
function connectPoints(x, y) {
    for (let i = 0; i < listOfPoints[0].length - 1; i++) {
        ctx.strokeStyle = "#c6c6c6";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(listOfPoints[0][i], listOfPoints[1][i]);
        ctx.stroke();
    }
}

let ind = 0;
canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    createPoint(x,y);
    listOfPoints[0][ind] = x;
    listOfPoints[1][ind] = y;
    connectPoints(x, y);
    ind++;
    console.log("Coordinate x: " + listOfPoints[0][listOfPoints[0].length-1], "Coordinate y: " + listOfPoints[1][listOfPoints[1].length-1]);
})

const button = document.createElement('button');
button.innerText = 'Run ant algorithm';
button.addEventListener('click', function() {
  let points = listOfPoints[0].map((x, i) => [x, listOfPoints[1][i]]);
  let length = points.length;
  let adjacencyMatrix = createAdjacencyMatrix(points, length);
  console.log("Adjacency Matrix", adjacencyMatrix);
  ants(adjacencyMatrix);
});
document.body.appendChild(button);

function createAdjacencyMatrix(points, length) {
  const adjacencyMatrix = Array.from(Array(length), () => Array(length).fill(0));
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (i !== j) { 
        let distance = Math.sqrt(Math.pow(points[j][0] - points[i][0], 2) + Math.pow(points[j][1] - points[i][1], 2)); 
        adjacencyMatrix[i][j] = distance; 
        adjacencyMatrix[j][i] = distance; 
      }
    }
  }
  return adjacencyMatrix;
}
