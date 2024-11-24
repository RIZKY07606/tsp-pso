export class Particle {
  constructor(nDimensi, objFunction) {
    this.nDimensi = nDimensi;
    this.position = [...Array(nDimensi).keys()]; // Permutasi
    this.pbest = [...this.position];
    this.pbestFitness = Infinity;
    this.fitness = Infinity;
    this.objFunction = objFunction;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  inisialisasi() {
    this.shuffle(this.position);
    this.pbest = [...this.position];
  }

  calculateFitness() {
    this.fitness = this.objFunction(this.position);
  }

  updatePosition() {
    const [i, j] = [
      Math.floor(Math.random() * this.nDimensi),
      Math.floor(Math.random() * this.nDimensi),
    ];
    [this.position[i], this.position[j]] = [this.position[j], this.position[i]]; // Swap
  }

  updatePbest() {
    if (this.fitness < this.pbestFitness) {
      this.pbestFitness = this.fitness;
      this.pbest = [...this.position];
    }
  }
}
