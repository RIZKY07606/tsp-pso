import { cities } from "./data.js";
import { haversineDistance } from "./utils.js";

// Buat matriks jarak antar kota
export const distanceMatrix = cities.map((cityA) =>
  cities.map((cityB) =>
    cityA === cityB
      ? 0
      : haversineDistance(cityA.lat, cityA.lon, cityB.lat, cityB.lon),
  ),
);

// Fungsi objektif TSP
export function tspFitness(route) {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += distanceMatrix[route[i]][route[i + 1]];
  }
  totalDistance += distanceMatrix[route[route.length - 1]][route[0]]; // Kembali ke kota awal
  return totalDistance;
}
