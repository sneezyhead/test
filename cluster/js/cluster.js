const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
let listOfPoints = [2];
listOfPoints[0] = []; //x
listOfPoints[1] = []; //y

function createPoint(x, y, color = 'black') {
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2*Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

let ind = 0;
canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    createPoint(x,y);
    listOfPoints[0][ind] = x;
    listOfPoints[1][ind] = y;
    ind++;
    console.log("Coordinate x: " + listOfPoints[0][listOfPoints[0].length-1], "Coordinate y: " + listOfPoints[1][listOfPoints[1].length-1]);
})

function createRandomPoints(numPoints) {
    for (let i = 0; i < numPoints; i++) {
      let x = Math.floor(Math.random() * canvas.width);
      let y = Math.floor(Math.random() * canvas.height);
      createPoint(x, y);
      listOfPoints[0][ind] = x;
      listOfPoints[1][ind] = y;
      ind++;
      console.log("Coordinate x: " + listOfPoints[0][listOfPoints[0].length-1], "Coordinate y: " + listOfPoints[1][listOfPoints[1].length-1]);
    }
  }


document.getElementById("form").addEventListener('submit', function(event) {
    event.preventDefault();
    let numPoints = document.getElementById("numPoints").value; 
    if (Number.isInteger(+numPoints) && +numPoints > 0) {
      createRandomPoints(+numPoints);
    } else {
      alert("The number of numbers must be positive.");
    }
  });

let clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  listOfPoints[0] = [];
  listOfPoints[1] = [];
});

let clusterizeButton = document.getElementById('clusterize');
clusterizeButton.addEventListener('click', function() {
  let k = document.getElementById('k').value;
  console.log(`Кластеризация на ${k} кластеров`);
  let clusters = kMeans(listOfPoints, k);
  console.log(clusters);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < clusters.length; i++) {
    let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    for (let j = 0; j < clusters[i].length; j++) {
        createPoint(clusters[i][j][0], clusters[i][j][1], color);
    }
  } 
});
  
const removeButton = document.createElement('button');
removeButton.textContent = 'Remove last point';
document.body.appendChild(removeButton);

function removeLastPoint() {
  if (ind > 0) {
    ind--;
    listOfPoints[0].pop();
    listOfPoints[1].pop();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // очищаем холст
    for (let i = 0; i < ind; i++) {
      createPoint(listOfPoints[0][i], listOfPoints[1][i]); // перерисовываем все точки, кроме последней
    }
  }
}
removeButton.addEventListener('click', removeLastPoint);

function kMeans(listOfPoints, k) {
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push([Math.random() * canvas.width, Math.random() * canvas.height]);
  }

  let maxIterations = 1000;
  let threshold = 0.001;
  let clusters = new Array(k);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    let tempClusters = new Array(k);
    for (let i = 0; i < k; i++) {
      tempClusters[i] = [];
    }

    for (let i = 0; i < listOfPoints[0].length; i++) {
      let minDistance = Number.POSITIVE_INFINITY;
      let clusterIndex = 0;

      for (let j = 0; j < k; j++) {
        let distance = Math.sqrt((listOfPoints[0][i] - centroids[j][0])**2 + (listOfPoints[1][i] - centroids[j][1])**2);

        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = j;
        }
      }

      tempClusters[clusterIndex].push([listOfPoints[0][i], listOfPoints[1][i], clusterIndex]);
    }

    let maxShift = 0;
    for (let i = 0; i < k; i++) {
      let sumX = 0;
      let sumY = 0;

      for (let j = 0; j < tempClusters[i].length; j++) {
        sumX += tempClusters[i][j][0];
        sumY += tempClusters[i][j][1];
      }

      let xShift = Math.abs(sumX / tempClusters[i].length - centroids[i][0]);
      let yShift = Math.abs(sumY / tempClusters[i].length - centroids[i][1]);

      maxShift = Math.max(maxShift, xShift, yShift);
      centroids[i][0] = sumX / tempClusters[i].length;
      centroids[i][1] = sumY / tempClusters[i].length;
    }

    if (maxShift < threshold) {
      break;
    }

    clusters = tempClusters;
  }

  return clusters;
}
  
