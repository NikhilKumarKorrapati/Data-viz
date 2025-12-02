document.addEventListener('DOMContentLoaded', async () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');
    const yearPlaceholder = document.getElementById('currentYear');

    if (yearPlaceholder) {
        yearPlaceholder.textContent = new Date().getFullYear();
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navLinks.classList.toggle('is-open');
        });
    }

    renderSkillChart();

    try {
        const [troops, cities, temperature] = await Promise.all([
            fetchCSV('Assignments/Minard/data/minard-troops.csv'),
            fetchCSV('Assignments/Minard/data/minard-cities.csv'),
            fetchCSV('Assignments/Minard/data/minard-temp.csv')
        ]);

        renderMinardChart(troops, cities, temperature);
        renderTemperatureTimeline(temperature);
        renderSurvivalChart(troops);
    } catch (error) {
        console.error('Failed to load Minard data', error);
    }
});

function renderSkillChart() {
    const canvas = document.getElementById('skillChart');
    if (!canvas) {
        return;
    }

    new Chart(canvas, {
        type: 'radar',
        data: {
            labels: ['Data Engineering', 'Visualization Craft', 'Experimentation', 'Stakeholder Enablement', 'Storytelling'],
            datasets: [
                {
                    label: 'Skill Focus',
                    data: [90, 95, 82, 88, 93],
                    backgroundColor: 'rgba(96, 165, 250, 0.35)',
                    borderColor: '#60a5fa',
                    borderWidth: 2,
                    pointBackgroundColor: '#60a5fa',
                    pointBorderColor: '#0b1220',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.14)' },
                    angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
                    pointLabels: { color: '#cbd5f5', font: { size: 12 } },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function parseCSV(text) {
    const rows = text.trim().split(/\r?\n/).filter(Boolean);
    const headers = extractColumns(rows.shift());
    return rows.map(row => {
        const cols = extractColumns(row);
        return headers.reduce((acc, header, index) => {
            const value = cols[index] ?? '';
            acc[header] = value;
            return acc;
        }, {});
    });
}

function extractColumns(row) {
    const matches = row.match(/(".*?"|[^",]+)(?=,|$)/g) || [];
    return matches.map(col => col.replace(/^"|"$/g, '').trim());
}

async function fetchCSV(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    const text = await response.text();
    return parseCSV(text);
}

function renderMinardChart(troops, cities, temperature) {
    const canvas = document.getElementById('minardChart');
    if (!canvas) {
        return;
    }

    const group1Advance = troops.filter(item => item.group === '1' && item.direction === 'Advance');
    const pathLabels = group1Advance.map(point => {
        const match = cities.find(city => city.long === point.long && city.lat === point.lat);
        return match && match.city ? match.city : point.direction;
    });

    const strength = group1Advance.map(point => Number(point.survivors) / 1000);

    const temperatureByLong = temperature.reduce((acc, entry) => {
        acc[Number(entry.long)] = Number(entry.temp);
        return acc;
    }, {});

    const tempSeries = group1Advance.map(point => {
        const key = findNearest(Object.keys(temperatureByLong).map(Number), Number(point.long));
        return key !== null ? temperatureByLong[key] : null;
    });

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: pathLabels,
            datasets: [
                {
                    label: 'Troop strength (thousands)',
                    data: strength,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    borderWidth: 2,
                    tension: 0.25,
                    yAxisID: 'y'
                },
                {
                    label: 'Temperature (°C)',
                    data: tempSeries,
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    borderDash: [6, 6],
                    borderWidth: 2,
                    tension: 0.25,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: { color: '#cbd5f5' }
                },
                tooltip: {
                    callbacks: {
                        title: items => items[0]?.label ?? '',
                        label: context => `${context.dataset.label}: ${context.parsed.y}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca9c9' },
                    grid: { color: 'rgba(148, 163, 184, 0.08)' }
                },
                y: {
                    position: 'left',
                    ticks: { color: '#fbbf24' },
                    grid: { color: 'rgba(148, 163, 184, 0.08)' }
                },
                y1: {
                    position: 'right',
                    ticks: { color: '#60a5fa', callback: value => `${value}°` },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

function renderTemperatureTimeline(temperature) {
    const canvas = document.getElementById('temperatureChart');
    if (!canvas) {
        return;
    }

    const filtered = temperature.filter(item => item.temp !== '');
    const labels = filtered.map(entry => entry.date || `Lon ${entry.long}`);
    const temps = filtered.map(entry => Number(entry.temp));

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    backgroundColor: temps.map(value => value <= -20 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)'),
                    borderRadius: 10,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca9c9' },
                    grid: { display: false }
                },
                y: {
                    ticks: { color: '#9ca9c9', callback: value => `${value}°` },
                    grid: { color: 'rgba(148, 163, 184, 0.08)' }
                }
            }
        }
    });
}

function renderSurvivalChart(troops) {
    const canvas = document.getElementById('survivalChart');
    if (!canvas) {
        return;
    }

    const groups = Array.from(new Set(troops.map(item => item.group))).sort();

    const stats = groups.map(group => {
        const groupData = troops.filter(item => item.group === group);
        const advance = groupData.filter(item => item.direction === 'Advance');
        const retreat = groupData.filter(item => item.direction === 'Retreat');

        const start = advance.length ? Math.max(...advance.map(item => Number(item.survivors))) : 0;
        const end = retreat.length ? Math.min(...retreat.map(item => Number(item.survivors))) : start;

        const survivalRate = start > 0 ? Math.round((end / start) * 100) : 0;

        return {
            group: `Group ${group}`,
            start,
            end,
            survivalRate
        };
    });

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: stats.map(item => item.group),
            datasets: [
                {
                    label: 'Campaign start',
                    data: stats.map(item => item.start),
                    backgroundColor: 'rgba(125, 211, 252, 0.65)',
                    borderRadius: 12,
                    borderSkipped: false
                },
                {
                    label: 'Campaign end',
                    data: stats.map(item => item.end),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 12,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#cbd5f5' }
                },
                tooltip: {
                    callbacks: {
                        afterBody: items => {
                            const index = items[0].dataIndex;
                            return `Survival rate: ${stats[index].survivalRate}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#9ca9c9' },
                    grid: { display: false }
                },
                y: {
                    ticks: {
                        color: '#9ca9c9',
                        callback: value => `${value.toLocaleString()}`
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.08)' }
                }
            }
        }
    });
}

function findNearest(values, target) {
    if (!values.length) {
        return null;
    }
    return values.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
}
