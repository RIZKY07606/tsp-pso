import { PSO } from "./pso.js";
import { tspFitness } from "./tsp.js";
import { cities } from "./data.js";

const resultTable = document.getElementById("resultTable");
const fitnessChart = document.getElementById("fitnessChart").getContext("2d");
const startButton = document.getElementById("startButton");

const chart = new Chart(fitnessChart, {
  type: "line",
  data: { labels: [], datasets: [{ label: "Gbest Fitness", data: [] }] },
});

startButton.addEventListener("click", () => {
  const pso = new PSO(10, cities.length, tspFitness);
  for (let i = 0; i < 50; i++) {
    pso.mainPSO();

    // Update tabel
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${i + 1}</td>
            <td>${pso.gbestFitness.toFixed(2)}</td>
            <td>${pso.gbestPosition.map((i) => cities[i].name).join(" → ")}</td>
        `;
    resultTable.appendChild(row);

    // Update chart
    chart.data.labels.push(i + 1);
    chart.data.datasets[0].data.push(pso.gbestFitness);
    chart.update();
  }
});
