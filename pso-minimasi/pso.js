import { Particle } from "./particle.js";

export class PSO {
  constructor(nParticles, nDimensi, objFunction) {
    this.particles = Array.from(
      { length: nParticles },
      () => new Particle(nDimensi, objFunction),
    );
    this.gbestFitness = Infinity;
    this.gbestPosition = [];
  }

  mainPSO() {
    this.particles.forEach((particle) => {
      particle.calculateFitness();
      particle.updatePbest();
      if (particle.fitness < this.gbestFitness) {
        this.gbestFitness = particle.fitness;
        this.gbestPosition = [...particle.position];
      }
      particle.updatePosition();
    });
  }
}
