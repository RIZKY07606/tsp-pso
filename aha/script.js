// Data Kota (Contoh)
import { cities } from "./data.js";

// Fungsi untuk menghitung jarak antar dua titik menggunakan Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius Bumi dalam kilometer
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Jarak dalam kilometer
}

// Fungsi untuk menghitung jarak total untuk seluruh rute
function calculateTotalDistance(route) {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(
      route[i].lat,
      route[i].lon,
      route[i + 1].lat,
      route[i + 1].lon,
    );
  }
  return totalDistance;
}

// Fungsi untuk menampilkan peta dengan marker untuk setiap kota
function showMap(route) {
  const map = L.map("map").setView([route[0].lat, route[0].lon], 7);

  // Tile layer untuk peta menggunakan OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Menambahkan marker untuk setiap kota dalam rute
  route.forEach((city) => {
    L.marker([city.lat, city.lon])
      .addTo(map)
      .bindPopup(`<b>${city.name}</b><br>Lat: ${city.lat}, Lon: ${city.lon}`);
  });

  // Animasi garis rute terbaik
  let routeCoordinates = route.map((city) => [city.lat, city.lon]);
  let polyline = L.polyline([], { color: "red", weight: 3 }).addTo(map);

  // Fungsi untuk menggambar garis secara bertahap
  let i = 0;
  function drawRouteStep() {
    if (i < routeCoordinates.length) {
      polyline.addLatLng(routeCoordinates[i]);
      i++;
      setTimeout(drawRouteStep, 500); // Setiap 500ms untuk memperbarui
    }
  }

  drawRouteStep(); // Memulai animasi menggambar garis
}

// Fungsi untuk menjalankan algoritma optimasi
function runOptimization(iterations = 100) {
  const distanceHistory = [];
  const timeHistory = [];
  let bestRoute = cities.slice(); // Dapatkan salinan dari array cities
  bestRoute.sort(() => Math.random() - 0.5); // Acak urutan kota
  let bestDistance = calculateTotalDistance(bestRoute);
  let bestTime = bestDistance / 60; // Asumsi 1 km = 1 menit
  let bestRouteResult = bestRoute; // Menyimpan rute terbaik

  for (let iteration = 0; iteration < iterations; iteration++) {
    // Simulasi perubahan posisi "hummingbird" untuk optimasi
    bestRoute.sort(() => Math.random() - 0.5); // Acak urutan kota lagi
    const currentDistance = calculateTotalDistance(bestRoute);

    // Catat hasil pada setiap iterasi
    distanceHistory.push(currentDistance);
    timeHistory.push(currentDistance / 60); // Asumsi 1 km = 1 menit

    // Jika jarak lebih baik, update
    if (currentDistance < bestDistance) {
      bestDistance = currentDistance;
      bestTime = currentDistance / 60;
      bestRouteResult = bestRoute; // Update rute terbaik
    }
  }

  return {
    bestRoute: bestRouteResult,
    bestDistance,
    bestTime,
    distanceHistory,
    timeHistory,
  };
}

// Fungsi untuk menggambar grafik jarak dan waktu (Line Chart dengan iterasi)
function showCharts(distanceHistory, timeHistory) {
  // Data untuk grafik jarak
  const distanceData = {
    labels: distanceHistory.map((_, index) => index + 1), // Iterasi sebagai label
    datasets: [
      {
        label: "Jarak (km)",
        data: distanceHistory,
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Transparan biru
        borderColor: "rgba(54, 162, 235, 1)", // Biru solid untuk garis
        borderWidth: 2, // Lebar garis
        fill: false, // Tidak mengisi area di bawah garis
      },
    ],
  };

  // Data untuk grafik waktu (misalkan estimasi waktu perjalanan)
  const timeData = {
    labels: timeHistory.map((_, index) => index + 1), // Iterasi sebagai label
    datasets: [
      {
        label: "Waktu (jam)",
        data: timeHistory,
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Transparan merah
        borderColor: "rgba(255, 99, 132, 1)", // Merah solid untuk garis
        borderWidth: 2, // Lebar garis
        fill: false, // Tidak mengisi area di bawah garis
      },
    ],
  };

  // Grafik jarak (warna biru)
  const ctxDistance = document.getElementById("distanceChart").getContext("2d");
  new Chart(ctxDistance, {
    type: "line", // Ubah menjadi "line" untuk grafik garis
    data: distanceData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Jarak (km)", // Menambahkan label sumbu Y
          },
        },
        x: {
          title: {
            display: true,
            text: "Iterasi", // Menambahkan label sumbu X
          },
        },
      },
    },
  });

  // Grafik waktu (warna merah)
  const ctxTime = document.getElementById("timeChart").getContext("2d");
  new Chart(ctxTime, {
    type: "line", // Ubah menjadi "line" untuk grafik garis
    data: timeData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Waktu (jam)", // Menambahkan label sumbu Y
          },
        },
        x: {
          title: {
            display: true,
            text: "Iterasi", // Menambahkan label sumbu X
          },
        },
      },
    },
  });
}

// Fungsi untuk menampilkan hasil terbaik di bawah grafik
function displayBestResult(bestDistance, bestTime, bestRoute) {
  const resultSection = document.getElementById("bestResult");
  resultSection.innerHTML = `
    <h3>Hasil Terbaik dari Iterasi</h3>
    <p><strong>Jarak Terbaik: </strong>${bestDistance.toFixed(2)} km</p>
    <p><strong>Waktu Terbaik: </strong>${bestTime.toFixed(2)} jam</p>
    <h4>Rute Terbaik:</h4>
    <ul>
      ${bestRoute
        .map((city, index) => {
          if (index === bestRoute.length - 1) {
            return `<li><strong>${city.name}</strong></li>`;
          } else {
            return `<li>${city.name} →</li>`;
          }
        })
        .join("")}
    </ul>
  `;
}

// Event listener untuk menjalankan algoritma dan menampilkan hasil
document.getElementById("runAlgorithm").addEventListener("click", () => {
  const { bestRoute, bestDistance, bestTime, distanceHistory, timeHistory } =
    runOptimization(100);

  showCharts(distanceHistory, timeHistory);
  displayBestResult(bestDistance, bestTime, bestRoute);
  showMap(bestRoute);
});
