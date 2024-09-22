const apiKey = process.env.API_KEY;  // Asegúrate de que esto esté configurado en Vercel
const compareBtn = document.getElementById("compareBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");
const body = document.body;

toggleThemeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    toggleThemeBtn.textContent = body.classList.contains("dark") ? "Modo Claro" : "Modo Oscuro";
});

compareBtn.addEventListener("click", async () => {
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;

    if (!player1 || !player2) {
        alert("Por favor, ingresa ambos nombres de jugadores.");
        return;
    }

    const stats1 = await fetchStats(player1);
    const stats2 = await fetchStats(player2);

    if (stats1 && stats2) {
        renderChart(stats1, stats2);
        renderRadarChart(stats1, stats2);
    } else {
        alert("Error al obtener las estadísticas. Verifica los nombres de los jugadores.");
    }
});

async function fetchStats(playerName) {
    try {
        const response = await fetch(`https://fortnite-api.com/v2/stats/br/v2?name=${playerName}`, {
            headers: {
                'Authorization': apiKey
            }
        });
        const data = await response.json();
        if (data.status === 200) {
            return data.data;
        }
    } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
    }
    return null;
}

function renderChart(stats1, stats2) {
    const ctx = document.getElementById("statsChart").getContext("2d");
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Victorias', 'Partidas Jugadas', 'K/D', 'Puntos'],
            datasets: [
                {
                    label: stats1.account.name,
                    data: [stats1.stats.placetop1.value, stats1.stats.matches.value, stats1.stats.kills.value / stats1.stats.matches.value, stats1.stats.score.value],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: stats2.account.name,
                    data: [stats2.stats.placetop1.value, stats2.stats.matches.value, stats2.stats.kills.value / stats2.stats.matches.value, stats2.stats.score.value],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderRadarChart(stats1, stats2) {
    const ctx = document.getElementById("radarChart").getContext("2d");
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Victorias', 'Partidas Jugadas', 'K/D', 'Puntos'],
            datasets: [
                {
                    label: stats1.account.name,
                    data: [stats1.stats.placetop1.value, stats1.stats.matches.value, stats1.stats.kills.value / stats1.stats.matches.value, stats1.stats.score.value],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: stats2.account.name,
                    data: [stats2.stats.placetop1.value, stats2.stats.matches.value, stats2.stats.kills.value / stats2.stats.matches.value, stats2.stats.score.value],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                }
            ]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
}
