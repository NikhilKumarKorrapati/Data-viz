document.addEventListener('DOMContentLoaded', () => {
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
            description: 'Recreated Charles Minard\'s 1812 campaign visualization with modern tooling, layering troop attrition and climate signals to surface decision triggers.',
            tags: ['Storytelling', 'Jupyter', 'Altair'],
            media: 'Assignments/Minard/Minard-1.png',
            links: [
                { label: 'View notebook', url: 'Assignments/Minard/Minard.ipynb' },
                { label: 'See dataset', url: 'Assignments/Minard/data/minard-troops.csv' }
            ]
        },
        {
            title: 'Storyboard: Retail Analytics',
            description: 'Storyboard for a retail performance dashboard covering merchandising KPIs, supply bottlenecks, and scenario-driven recommendations.',
            tags: ['Storyboard', 'User Journey', 'Figma'],
            media: 'Assignments/Assignment-1(storyboard).pdf',
            links: [
                { label: 'Download storyboard', url: 'Assignments/Assignment-1(storyboard).pdf' }
            ]
        },
        {
            title: 'Annotated Dashboard Critique',
            description: 'Annotated critique of an analytics dashboard focusing on accessibility, hierarchy, and communication clarity.',
            tags: ['Dashboard Design', 'Accessibility', 'Case Study'],
            media: 'Assignments/annotated-Assignment-3.pdf',
            links: [
                { label: 'Read annotations', url: 'Assignments/annotated-Assignment-3.pdf' }
            ]
        },
        {
            title: 'Customer Growth Diagnostics',
            description: 'Segment-level funnel diagnostics combining churn prediction, cohort analytics, and activation scoring to prioritize experimentation.',
            tags: ['Predictive Modeling', 'Cohort Analysis', 'Plotly'],
            media: null,
            links: [
                { label: 'Explore live dashboard', url: '#insights' },
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

    const chartConfig = (context, gradientStops) => {
        const ctx = context.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradientStops.forEach(stop => gradient.addColorStop(stop.offset, stop.color));
        return gradient;
    };

    const heroCanvas = document.getElementById('heroChart');
    if (heroCanvas) {
        const gradient = chartConfig(heroCanvas, [
            { offset: 0, color: 'rgba(56, 189, 248, 0.45)' },
            { offset: 1, color: 'rgba(56, 189, 248, 0.05)' }
        ]);

        new Chart(heroCanvas, {
            type: 'line',
            data: {
                labels: ['Discovery', 'Prototype', 'Model', 'Launch'],
                datasets: [
                    {
                        label: 'Insight Velocity',
                        data: [14, 36, 58, 92],
                        fill: true,
                        backgroundColor: gradient,
                        borderColor: '#38bdf8',
                        tension: 0.45,
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: '#0f172a',
                        pointBorderColor: '#38bdf8'
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
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.08)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.08)' }
                    }
                }
            }
        });
    }

    const minardCanvas = document.getElementById('minardChart');
    if (minardCanvas) {
        new Chart(minardCanvas, {
            type: 'line',
            data: {
                labels: ['Kowno', 'Wilna', 'Smorgoni', 'Minsk', 'Mojaisk', 'Moscow', 'Smolensk', 'Orsha', 'Borisov', 'Vilna'],
                datasets: [
                    {
                        label: 'Troop Strength (thousands)',
                        data: [422, 400, 340, 320, 150, 100, 60, 37, 24, 10],
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.15)',
                        borderWidth: 2.2,
                        tension: 0.35,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Temperature (°C)',
                        data: [-1, -5, -9, -15, -20, -25, -27, -33, -30, -22],
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        borderDash: [6, 6],
                        borderWidth: 2,
                        tension: 0.35,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        labels: { color: '#cbd5f5' }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const value = context.formattedValue;
                                return `${context.dataset.label}: ${value}`;
                            }
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
    }

    const revenueCanvas = document.getElementById('revenueChart');
    if (revenueCanvas) {
        new Chart(revenueCanvas, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        type: 'line',
                        label: 'Forecast',
                        data: [82, 88, 94, 100, 108, 118, 126, 132, 136, 142, 148, 155],
                        borderColor: '#facc15',
                        borderWidth: 2,
                        tension: 0.35,
                        pointRadius: 3,
                        fill: false
                    },
                    {
                        label: 'Actuals',
                        data: [78, 84, 96, 102, 112, 120, 129, 135, 140, 146, 152, 161],
                        backgroundColor: 'rgba(56, 189, 248, 0.65)',
                        borderRadius: 8,
                        barPercentage: 0.65
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5f5' }
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
                            callback: value => `$${value}k`
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.08)' }
                    }
                }
            }
        });
    }

    const conversionCanvas = document.getElementById('conversionChart');
    if (conversionCanvas) {
        new Chart(conversionCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Enterprise', 'Scale-up', 'SMB', 'Self-serve'],
                datasets: [
                    {
                        data: [32, 26, 18, 24],
                        backgroundColor: [
                            'rgba(56, 189, 248, 0.8)',
                            'rgba(59, 130, 246, 0.75)',
                            'rgba(96, 165, 250, 0.75)',
                            'rgba(37, 99, 235, 0.75)'
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
                                const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                const current = context.parsed;
                                const percent = ((current / total) * 100).toFixed(1);
                                return `${context.label}: ${current}% • ${percent}% share`;
                            }
                        }
                    }
                }
            }
        });
    }
});
