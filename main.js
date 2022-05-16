const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateCars(N);

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")];

animate();

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), -100, 30, 50, "AI"));
  }

  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    car.update(road.borders, traffic);
  }
  carCanvas.height = window.innerHeight;

  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -cars[0].y + carCanvas.height * 0.7);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  road.draw(carCtx);

  carCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    car.draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  cars[0].draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  // Visualize neural network
  Visualizer.drawNetwork(networkCtx, cars[0].brain);
  requestAnimationFrame(animate);
}
