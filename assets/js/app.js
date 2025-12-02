document.addEventListener('DOMContentLoaded', async () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');
    const yearPlaceholder = document.getElementById('currentYear');
    const projectGrid = document.getElementById('projectGrid');

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

    const projects = [
        {
            title: 'Minard Campaign Narrative',
            description: 'Reimagined the 1812 expedition using Python, Pandas, and Altair. The notebook layers troop attrition, longitude/latitude paths, and temperature annotations.',
            tags: ['Storytelling', 'Jupyter', 'Altair'],
            media: 'Assignments/Minard/Minard-1.png',
            links: [
                { label: 'View notebook', url: 'Assignments/Minard/Minard.ipynb' },
                { label: 'See dataset', url: 'Assignments/Minard/data/minard-troops.csv' }
            ]
        },
        {
            title: 'Retail Analytics Storyboard',
            description: 'Storyboard aligning merchandising KPIs, supply risk, and scenario branches before dashboard build — a pre-read for business stakeholders.',
            tags: ['Storyboard', 'Experience Design', 'Planning'],
            media: 'Assignments/Assignment-1(storyboard).pdf',
            links: [
                { label: 'Download storyboard', url: 'Assignments/Assignment-1(storyboard).pdf' }
            ]
        },
        {
            title: 'Dashboard Critique Annotations',
            description: 'Annotated critique focused on accessibility, hierarchy, and communication clarity. Highlights actionable layout and color recommendations.',
            tags: ['Dashboard Design', 'Accessibility', 'Critique'],
            media: 'Assignments/annotated-Assignment-3.pdf',
            links: [
                { label: 'Read annotations', url: 'Assignments/annotated-Assignment-3.pdf' }
            ]
        },
        {
            title: 'Customer Growth Diagnostics',
            description: 'Cohort analysis and experimentation backlog tracker connecting churn prediction, activation scoring, and growth hypotheses.',
            tags: ['Cohort Analysis', 'Experimentation', 'Product Analytics'],
            media: null,
            links: [
                { label: 'Explore charts', url: '#insights' },
                { label: 'Request walkthrough', url: '#contact' }
            ]
        }
    ];

    if (projectGrid) {
        projects.forEach(project => {
            const card = document.createElement('article');
            card.className = 'project-card';

            if (project.media) {
                const mediaWrap = document.createElement('div');
                mediaWrap.className = 'project-card__media';

                if (project.media.endsWith('.pdf')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'project-card__placeholder';
                    placeholder.textContent = 'PDF Preview';
                    mediaWrap.appendChild(placeholder);
                } else {
                    const img = document.createElement('img');
                    img.src = project.media;
                    img.alt = `${project.title} visual preview`;
                    mediaWrap.appendChild(img);
                }

                card.appendChild(mediaWrap);
            }

            const title = document.createElement('h3');
            title.textContent = project.title;
            card.appendChild(title);

            const description = document.createElement('p');
            description.textContent = project.description;
            card.appendChild(description);

            if (project.tags?.length) {
                const tagWrap = document.createElement('div');
                tagWrap.className = 'project-card__tags';
                project.tags.forEach(tag => {
                    const badge = document.createElement('span');
                    badge.className = 'tag';
                    badge.textContent = tag;
                    tagWrap.appendChild(badge);
                });
                card.appendChild(tagWrap);
            }

            if (project.links?.length) {
                const linkWrap = document.createElement('div');
                linkWrap.className = 'project-card__links';
                project.links.forEach(link => {
                    const anchor = document.createElement('a');
                    anchor.href = link.url;
                    anchor.textContent = link.label;
                    if (link.url.startsWith('http') || link.url.endsWith('.pdf') || link.url.endsWith('.ipynb')) {
                        anchor.target = '_blank';
                        anchor.rel = 'noopener';
                    }
                    linkWrap.appendChild(anchor);
                });
                card.appendChild(linkWrap);
            }

            projectGrid.appendChild(card);
        });
    }

    const heroCanvas = document.getElementById('heroChart');
    if (heroCanvas) {
        new Chart(heroCanvas, {
            type: 'radar',
            data: {
                labels: ['Data Engineering', 'Visualization Craft', 'Experimentation', 'Stakeholder Enablement', 'Storytelling'],
                datasets: [
                    {
                        label: 'Skill Focus',
                        data: [90, 96, 82, 88, 94],
                        backgroundColor: 'rgba(56, 189, 248, 0.35)',
                        borderColor: '#38bdf8',
                        borderWidth: 2,
                        pointBackgroundColor: '#38bdf8',
                        pointBorderColor: '#0f172a',
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
                        grid: { color: 'rgba(148, 163, 184, 0.12)' },
                        angleLines: { color: 'rgba(148, 163, 184, 0.12)' },
                        pointLabels: { color: '#cbd5f5', font: { size: 12 } },
                        ticks: { display: false, maxTicksLimit: 4 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    await renderMinardChart();
    renderCoverageChart();
    renderFormatsChart();
});

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

async function renderMinardChart() {
    const minardCanvas = document.getElementById('minardChart');
    if (!minardCanvas) {
        return;
    }

    try {
        const [pathData, temperatureData] = await Promise.all([
            fetchCSV('Assignments/Minard/data/minard-cities.csv'),
            fetchCSV('Assignments/Minard/data/minard-temp.csv')
        ]);

        const primaryPath = pathData.filter(point => point.group === '1');
        const labels = primaryPath.map((point, index) => point.city || `${point.direction} ${index + 1}`);
        const survivors = primaryPath.map(point => Number(point.survivors) / 1000);

        const temps = primaryPath.map(point => {
            const pointLong = Number(point.long);
            const entry = temperatureData.find(temp => Math.abs(Number(temp.long) - pointLong) < 0.35);
            return entry ? Number(entry.temp) : null;
        });

        new Chart(minardCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Troop Strength (thousands)',
                        data: survivors,
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.15)',
                        borderWidth: 2.2,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Temperature (°C)',
                        data: temps,
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.2)',
                        borderDash: [6, 6],
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#cbd5f5' } },
                    tooltip: {
                        callbacks: {
                            title: items => items[0]?.label ?? '',
                            label: context => `${context.dataset.label}: ${context.parsed.y}`
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.08)' }
                    },
                    y: {
                        position: 'left',
                        ticks: {
                            color: '#fda769',
                            callback: value => `${value}`
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.08)' }
                    },
                    y1: {
                        position: 'right',
                        ticks: {
                            color: '#38bdf8',
                            callback: value => `${value}°`
                        },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

function renderCoverageChart() {
    const coverageCanvas = document.getElementById('coverageChart');
    if (!coverageCanvas) {
        return;
    }

    new Chart(coverageCanvas, {
        type: 'bar',
        data: {
            labels: ['Pipelines & Platforms', 'Analytics & Visualization', 'Enablement & Collaboration'],
            datasets: [
                {
                    label: 'Time Allocation (%)',
                    data: [35, 45, 20],
                    backgroundColor: [
                        'rgba(14, 165, 233, 0.65)',
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(165, 180, 252, 0.7)'
                    ],
                    borderRadius: 10,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#cbd5f5' } },
                tooltip: {
                    callbacks: {
                        label: context => `${context.parsed.y}% focus`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: value => `${value}%`
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.08)' }
                }
            }
        }
    });
}

function renderFormatsChart() {
    const formatsCanvas = document.getElementById('formatsChart');
    if (!formatsCanvas) {
        return;
    }

    new Chart(formatsCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Decision-ready dashboards', 'Narrative scrollytelling', 'Comparative visuals'],
            datasets: [
                {
                    data: [40, 32, 28],
                    backgroundColor: [
                        'rgba(56, 189, 248, 0.85)',
                        'rgba(14, 165, 233, 0.85)',
                        'rgba(2, 132, 199, 0.85)'
                    ],
                    borderColor: '#0f172a',
                    borderWidth: 3,
                    hoverOffset: 10
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5f5', padding: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                            const share = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed}% focus • ${share}% share`;
                        }
                    }
                }
            }
        }
    });
}
