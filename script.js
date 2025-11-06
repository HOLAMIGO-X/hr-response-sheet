// Global variables
let currentData = null;
let chartInstances = [];

// Question mappings (now using English column names for combined data)
const questions = {
    timestamp: 'Timestamp',
    email: 'Email address',
    name: 'Name and Employee ID',
    tablet_working: 'Is the tablet working well for consultations?',
    internet_problems: 'Do you face internet problems during consultations?',
    tablet_knowledge: 'Do you know how to use the tablet?',
    quick_help: 'If tablet or internet has a problem, do you get help quickly?',
    doctor_respectful: 'Are the doctors nice and respectful during consultations?',
    partner_problems: 'Do you face any problems working with the partner staff in the clinic?  ',
    clinic_timings: 'Are you comfortable with the current clinic timings? ',
    timing_changes: 'If not, please tell us what timing changes would help you work better:  ',
    explain_advice: 'Are you able to explain doctor\'s advice to patients clearly?',
    clinic_clean: 'Is your clinic clean and in a good condition?',
    feel_safe: 'Do you feel safe working alone in the clinic?',
    medicines_available: 'Do you get all the medicines you need at the clinic?',
    managers_helpful: 'Are your DCs and field managers helpful?',
    monthly_target: 'Are you able to complete your monthly target?',
    patient_behavior: 'Do patients behave well with you?',
    patient_trust: 'Do patients trust you at the clinic?',
    camp_help: 'Do you get help during health diagnostic camps?',
    equipment_working: 'Are all the essential equipment in the clinic working properly?',
    additional_training: 'Do you require any additional training?',
    proud_of_work: 'Do you feel proud of your work?',
    career_growth: 'Do you feel you can grow in your career while working at M-Swasth? ',
    recommend_rating: 'Would you tell a friend to work here? (Rate from 1 to 10)',
    distance: 'How far is the clinic from your residence? (in meters/ kilometers)',
    additional_help: 'Any additional help you require to work better?',
    clinic_improvements: 'Things that can make your clinic better',
    management_feedback: 'Any feedback for the management',
    language: 'Language'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load combined embedded data
    if (typeof embeddedData !== 'undefined') {
        console.log('Loading combined data...');
        console.log(`Total responses: ${embeddedData.length}`);
        processData(embeddedData);
    } else {
        console.error('Embedded data not found!');
    }
});

function processData(data) {
    currentData = data;
    console.log('Processing combined data...');
    console.log('Available Columns:', Object.keys(data[0]));
    renderDashboard();
}

// Render Dashboard
function renderDashboard() {
    if (!currentData || currentData.length === 0) return;

    const dashboardContent = document.getElementById('dashboardContent');

    // Clear previous charts
    chartInstances.forEach(chart => chart.destroy());
    chartInstances = [];

    const html = `
        ${renderStats()}
        ${renderAllCharts()}
        ${renderDetailedTables()}
    `;

    dashboardContent.innerHTML = html;
    initializeAllCharts();
}

function renderStats() {
    const totalResponses = currentData.length;

    // Count by language
    const englishCount = currentData.filter(row => row[questions.language] === 'English').length;
    const hindiCount = currentData.filter(row => row[questions.language] === 'Hindi').length;

    // Calculate metrics
    const recommendScores = currentData
        .map(row => parseFloat(row[questions.recommend_rating]))
        .filter(score => !isNaN(score));
    const avgRecommendation = recommendScores.length > 0
        ? (recommendScores.reduce((a, b) => a + b, 0) / recommendScores.length).toFixed(1)
        : 'N/A';

    // Overall satisfaction
    const allYesNoQuestions = [
        questions.tablet_working, questions.clinic_clean, questions.feel_safe,
        questions.medicines_available, questions.managers_helpful, questions.proud_of_work,
        questions.patient_behavior, questions.patient_trust, questions.equipment_working
    ].filter(q => q);

    let totalPositive = 0;
    let totalAnswers = 0;

    allYesNoQuestions.forEach(q => {
        currentData.forEach(row => {
            const answer = row[q];
            if (answer && answer.trim()) {
                totalAnswers++;
                if (answer.toLowerCase() === 'yes' || answer === 'हाँ') {
                    totalPositive++;
                }
            }
        });
    });

    const satisfactionRate = totalAnswers > 0
        ? ((totalPositive / totalAnswers) * 100).toFixed(1)
        : 'N/A';

    // Training needs
    const needsTraining = countResponses(questions.additional_training, ['yes', 'maybe later', 'हाँ', 'शायद बाद में']);
    const trainingPercentage = ((needsTraining / totalResponses) * 100).toFixed(0);

    // Internet issues
    const internetIssues = countResponses(questions.internet_problems, ['yes', 'sometimes', 'हाँ', 'कभी-कभी']);
    const internetPercentage = ((internetIssues / totalResponses) * 100).toFixed(0);

    // Target completion
    const targetCompleted = countResponses(questions.monthly_target, ['yes', 'हाँ']);
    const targetPercentage = ((targetCompleted / totalResponses) * 100).toFixed(0);

    // Career growth
    const careerGrowth = countResponses(questions.career_growth, ['yes', 'हाँ']);
    const careerPercentage = ((careerGrowth / totalResponses) * 100).toFixed(0);

    return `
        <div class="stats-grid">
            <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <h3>Total Responses</h3>
                <div class="value">${totalResponses}</div>
                <div class="label">Combined (English: ${englishCount} + Hindi: ${hindiCount})</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <h3>NPS Score</h3>
                <div class="value">${avgRecommendation}/10</div>
                <div class="label">Average Recommendation</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <h3>Satisfaction Rate</h3>
                <div class="value">${satisfactionRate}%</div>
                <div class="label">Positive Responses</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <h3>Training Needs</h3>
                <div class="value">${trainingPercentage}%</div>
                <div class="label">Need Additional Training</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
                <h3>Internet Issues</h3>
                <div class="value">${internetPercentage}%</div>
                <div class="label">Face Connectivity Issues</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                <h3>Career Growth</h3>
                <div class="value">${careerPercentage}%</div>
                <div class="label">See Career Growth</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);">
                <h3>Data Quality</h3>
                <div class="value">${((recommendScores.length / totalResponses) * 100).toFixed(0)}%</div>
                <div class="label">Complete Responses</div>
            </div>
        </div>
    `;
}

function renderAllCharts() {
    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <h2>Comprehensive Visual Analytics</h2>
        </div>

        <!-- Technology & Infrastructure -->
        <h3 class="category-title">💻 Technology & Infrastructure</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>Tablet Functionality</h3>
                <div class="chart-wrapper"><canvas id="tabletWorkingChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Internet Connectivity Issues</h3>
                <div class="chart-wrapper"><canvas id="internetProblemsChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Tablet Usage Knowledge</h3>
                <div class="chart-wrapper"><canvas id="tabletKnowledgeChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Technical Support Response</h3>
                <div class="chart-wrapper"><canvas id="quickHelpChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Equipment Status</h3>
                <div class="chart-wrapper"><canvas id="equipmentChart"></canvas></div>
            </div>
        </div>

        <!-- Clinical Operations -->
        <h3 class="category-title">🏥 Clinical Operations</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>Clinic Cleanliness & Condition</h3>
                <div class="chart-wrapper"><canvas id="clinicCleanChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Medicine Availability</h3>
                <div class="chart-wrapper"><canvas id="medicinesChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Clinic Timing Satisfaction</h3>
                <div class="chart-wrapper"><canvas id="timingChart"></canvas></div>
            </div>
        </div>

        <!-- Doctor & Team Interaction -->
        <h3 class="category-title">👨‍⚕️ Doctor & Team Interaction</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>Doctor Behavior & Respect</h3>
                <div class="chart-wrapper"><canvas id="doctorRespectChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Manager Helpfulness</h3>
                <div class="chart-wrapper"><canvas id="managersChart"></canvas></div>
            </div>
        </div>

        <!-- Patient Relations -->
        <h3 class="category-title">🤝 Patient Relations</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>Patient Behavior</h3>
                <div class="chart-wrapper"><canvas id="patientBehaviorChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Patient Trust Levels</h3>
                <div class="chart-wrapper"><canvas id="patientTrustChart"></canvas></div>
            </div>
        </div>

        <!-- Employee Satisfaction & Growth -->
        <h3 class="category-title">📈 Employee Satisfaction & Growth</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>Workplace Safety Perception</h3>
                <div class="chart-wrapper"><canvas id="safetyChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Work Pride & Satisfaction</h3>
                <div class="chart-wrapper"><canvas id="proudChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>Career Growth Perception</h3>
                <div class="chart-wrapper"><canvas id="careerGrowthChart"></canvas></div>
            </div>
        </div>

        <!-- NPS & Overall -->
        <h3 class="category-title">⭐ Net Promoter Score & Overall Metrics</h3>
        <div class="chart-grid">
            <div class="chart-container full-width-chart">
                <h3>Recommendation Score Distribution (NPS)</h3>
                <div class="chart-wrapper"><canvas id="recommendationChart"></canvas></div>
            </div>
            <div class="chart-container full-width-chart">
                <h3>Overall Satisfaction Radar</h3>
                <div class="chart-wrapper"><canvas id="overallRadarChart"></canvas></div>
            </div>
        </div>
    `;
}

function renderDetailedTables() {
    // Using global questions object;

    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <h2>Detailed Data Tables</h2>
        </div>

        ${renderResponseSummaryTable()}
        ${renderTopFeedbackTable()}
    `;
}

function renderResponseSummaryTable() {
    // Using global questions object;

    const summaryData = [
        { question: 'Tablet Working', key: questions.tablet_working },
        { question: 'Internet Problems', key: questions.internet_problems },
        { question: 'Clinic Clean', key: questions.clinic_clean },
        { question: 'Feel Safe', key: questions.feel_safe },
        { question: 'Medicines Available', key: questions.medicines_available },
        { question: 'Managers Helpful', key: questions.managers_helpful },
        { question: 'Monthly Target', key: questions.monthly_target },
        { question: 'Patient Behavior', key: questions.patient_behavior },
        { question: 'Patient Trust', key: questions.patient_trust },
        { question: 'Proud of Work', key: questions.proud_of_work },
        { question: 'Career Growth', key: questions.career_growth }
    ];

    let tableRows = '';
    summaryData.forEach(item => {
        if (item.key) {
            const counts = getResponseCounts(item.key,
                ['Yes', 'No', 'Sometimes']);
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            const yesPercent = total > 0 ? ((counts['Yes'] / total) * 100).toFixed(1) : 0;

            tableRows += `
                <tr>
                    <td><strong>${item.question}</strong></td>
                    <td>${counts['Yes'] || 0}</td>
                    <td>${counts['No'] || 0}</td>
                    <td>${counts['Sometimes'] || 0}</td>
                    <td><span class="sentiment-${yesPercent > 70 ? 'positive' : yesPercent > 40 ? 'neutral' : 'negative'}">${yesPercent}%</span></td>
                </tr>
            `;
        }
    });

    return `
        <div class="table-section">
            <h3>Response Summary by Question</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Yes</th>
                        <th>No</th>
                        <th>Sometimes</th>
                        <th>Positive %</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
}

function renderTopFeedbackTable() {
    // Using global questions object;

    const feedbackData = currentData
        .filter(row => {
            const feedback = row[questions.management_feedback];
            if (!feedback) return false;
            const feedbackStr = String(feedback).trim();
            return feedbackStr &&
                   feedbackStr.toLowerCase() !== 'no' &&
                   feedbackStr.toLowerCase() !== 'नहीं';
        })
        .slice(0, 10);

    if (feedbackData.length === 0) return '';

    const tableRows = feedbackData.map(row => `
        <tr>
            <td>${row[questions.name] || 'Anonymous'}</td>
            <td>${row[questions.management_feedback]}</td>
            <td>${row[questions.recommend_rating] || 'N/A'}</td>
        </tr>
    `).join('');

    return `
        <div class="table-section">
            <h3>Management Feedback Highlights</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Feedback</th>
                        <th>NPS</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;
}

function renderNPSBreakdownTable() {
    // Using global questions object;

    const npsData = {
        promoters: 0,
        passives: 0,
        detractors: 0
    };

    currentData.forEach(row => {
        const score = parseInt(row[questions.recommend_rating]);
        if (!isNaN(score)) {
            if (score >= 9) npsData.promoters++;
            else if (score >= 7) npsData.passives++;
            else npsData.detractors++;
        }
    });

    const total = npsData.promoters + npsData.passives + npsData.detractors;
    const npsScore = total > 0 ?
        (((npsData.promoters - npsData.detractors) / total) * 100).toFixed(1) : 0;

    return `
        <div class="table-section">
            <h3>Net Promoter Score (NPS) Breakdown</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Score Range</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="sentiment-positive">Promoters</span></td>
                        <td>9-10</td>
                        <td>${npsData.promoters}</td>
                        <td>${total > 0 ? ((npsData.promoters / total) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td><span class="sentiment-neutral">Passives</span></td>
                        <td>7-8</td>
                        <td>${npsData.passives}</td>
                        <td>${total > 0 ? ((npsData.passives / total) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td><span class="sentiment-negative">Detractors</span></td>
                        <td>1-6</td>
                        <td>${npsData.detractors}</td>
                        <td>${total > 0 ? ((npsData.detractors / total) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr style="background: #f0f9ff; font-weight: bold;">
                        <td colspan="3">Net Promoter Score</td>
                        <td><span class="sentiment-${npsScore > 50 ? 'positive' : npsScore > 0 ? 'neutral' : 'negative'}">${npsScore}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderTextAnalysis() {
    // Using global questions object;

    const improvements = currentData
        .filter(row => {
            const improvement = row[questions.clinic_improvements];
            if (!improvement) return false;
            const improvementStr = String(improvement).trim();
            return improvementStr &&
                   improvementStr.toLowerCase() !== 'no' &&
                   improvementStr !== 'नहीं' &&
                   improvementStr !== '.';
        })
        .slice(0, 15);

    const additionalHelp = currentData
        .filter(row => {
            const help = row[questions.additional_help];
            if (!help) return false;
            const helpStr = String(help).trim();
            return helpStr &&
                   helpStr.toLowerCase() !== 'no' &&
                   helpStr !== 'नहीं';
        })
        .slice(0, 15);

    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2>Qualitative Feedback Analysis</h2>
        </div>

        <div class="insights-grid">
            <div class="insight-card">
                <h4>Clinic Improvement Suggestions</h4>
                <ul style="margin-top: 10px; color: #4b5563;">
                    ${improvements.map(row => `<li>${row[questions.clinic_improvements]}</li>`).join('')}
                </ul>
            </div>
            <div class="insight-card">
                <h4>Additional Help Requested</h4>
                <ul style="margin-top: 10px; color: #4b5563;">
                    ${additionalHelp.map(row => `<li>${row[questions.additional_help]}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderInsights() {
    // Using global questions object;

    const internetIssues = countResponses(questions.internet_problems, ['sometimes', 'yes', 'कभी-कभी', 'हाँ']);
    const needsTraining = countResponses(questions.additional_training, ['yes', 'maybe later', 'हाँ', 'शायद बाद में']);
    const targetCompleted = countResponses(questions.monthly_target, ['yes', 'हाँ']);
    const feelSafe = countResponses(questions.feel_safe, ['yes', 'हाँ']);
    const medicinesAvailable = countResponses(questions.medicines_available, ['yes', 'हाँ']);
    const careerGrowth = countResponses(questions.career_growth, ['yes', 'हाँ']);

    const insights = [];

    if (internetIssues > currentData.length * 0.3) {
        insights.push({
            type: 'warning',
            title: '⚠️ Internet Connectivity Concerns',
            text: `${((internetIssues / currentData.length) * 100).toFixed(0)}% of nurses report internet connectivity issues during consultations. Immediate attention needed.`
        });
    }

    if (needsTraining > 0) {
        insights.push({
            type: 'warning',
            title: '📚 Training Gap Identified',
            text: `${needsTraining} nurses (${((needsTraining / currentData.length) * 100).toFixed(0)}%) have requested additional training. Consider organizing skill development programs.`
        });
    }

    if (targetCompleted > currentData.length * 0.7) {
        insights.push({
            type: 'success',
            title: '✅ Excellent Performance',
            text: `${((targetCompleted / currentData.length) * 100).toFixed(0)}% of nurses are successfully meeting their monthly targets. Great performance!`
        });
    }

    if (feelSafe > currentData.length * 0.8) {
        insights.push({
            type: 'success',
            title: '🛡️ Strong Safety Perception',
            text: `${((feelSafe / currentData.length) * 100).toFixed(0)}% of nurses feel safe working alone in the clinic. Positive work environment.`
        });
    }

    if (medicinesAvailable < currentData.length * 0.7) {
        insights.push({
            type: 'warning',
            title: '💊 Medicine Availability Issue',
            text: `Only ${((medicinesAvailable / currentData.length) * 100).toFixed(0)}% report all essential medicines are available. Stock management needs improvement.`
        });
    }

    if (careerGrowth > currentData.length * 0.6) {
        insights.push({
            type: 'success',
            title: '📈 Positive Career Outlook',
            text: `${((careerGrowth / currentData.length) * 100).toFixed(0)}% believe they can grow their career at M-Swasth. Strong retention potential.`
        });
    }

    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h2>Key Insights & Recommendations</h2>
        </div>
        <div class="insights-grid">
            ${insights.map(insight => `
                <div class="insight-card ${insight.type}">
                    <h4>${insight.title}</h4>
                    <p>${insight.text}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function countResponses(question, targetValues) {
    if (!question) return 0;

    // Map Hindi responses to English equivalents
    const hindiToEnglish = {
        'हाँ': 'yes',
        'नहीं': 'no',
        'कभी-कभी': 'sometimes',
        'शायद बाद में': 'maybe later'
    };

    return currentData.filter(row => {
        const answer = row[question];
        if (!answer) return false;
        const normalizedAnswer = answer.toString().trim();
        const lowerAnswer = normalizedAnswer.toLowerCase();

        // Map Hindi to English if needed
        const mappedAnswer = hindiToEnglish[normalizedAnswer] || lowerAnswer;

        return targetValues.some(val => mappedAnswer.includes(val.toLowerCase()));
    }).length;
}

function getResponseCounts(question, possibleAnswers) {
    const counts = {};
    possibleAnswers.forEach(answer => counts[answer] = 0);

    // If question is undefined or null, return empty counts
    if (!question) {
        console.warn('Question is undefined, returning empty counts');
        return counts;
    }

    // Map Hindi responses to English equivalents
    const hindiToEnglish = {
        'हाँ': 'Yes',
        'नहीं': 'No',
        'कभी-कभी': 'Sometimes',
        'शायद बाद में': 'Maybe later',
        'yes': 'Yes',
        'no': 'No',
        'sometimes': 'Sometimes',
        'maybe later': 'Maybe later'
    };

    currentData.forEach(row => {
        const answer = row[question];
        if (answer) {
            const normalizedAnswer = String(answer).trim();
            const lowerAnswer = normalizedAnswer.toLowerCase();

            // Check if it's a Hindi response that needs mapping
            let mappedAnswer = hindiToEnglish[normalizedAnswer] || hindiToEnglish[lowerAnswer] || normalizedAnswer;

            // Count against the possible answers
            possibleAnswers.forEach(possible => {
                if (mappedAnswer.toLowerCase() === possible.toLowerCase() ||
                    mappedAnswer === possible) {
                    counts[possible]++;
                }
            });
        }
    });

    return counts;
}

function initializeAllCharts() {
    // Using global questions object;
    const yesNoSometimes = ['Yes', 'No', 'Sometimes'];

    // Chart colors
    const colors = {
        green: '#10b981',
        red: '#ef4444',
        yellow: '#f59e0b',
        blue: '#2563eb',
        purple: '#8b5cf6',
        pink: '#ec4899'
    };

    // Technology & Infrastructure Charts
    createPieChart('tabletWorkingChart', getResponseCounts(questions.tablet_working, yesNoSometimes));
    createDoughnutChart('internetProblemsChart', getResponseCounts(questions.internet_problems, yesNoSometimes));
    createPieChart('tabletKnowledgeChart', getResponseCounts(questions.tablet_knowledge, yesNoSometimes));
    createBarChart('quickHelpChart', getResponseCounts(questions.quick_help, yesNoSometimes));
    createPieChart('equipmentChart', getResponseCounts(questions.equipment_working, yesNoSometimes));

    // Clinical Operations Charts
    createDoughnutChart('clinicCleanChart', getResponseCounts(questions.clinic_clean, yesNoSometimes));
    createBarChart('medicinesChart', getResponseCounts(questions.medicines_available, yesNoSometimes));
    createPieChart('timingChart', getResponseCounts(questions.clinic_timings, yesNoSometimes));
    createBarChart('campHelpChart', getResponseCounts(questions.camp_help, yesNoSometimes));

    // Doctor & Team Interaction Charts
    createDoughnutChart('doctorRespectChart', getResponseCounts(questions.doctor_respectful, yesNoSometimes));
    createBarChart('explainAdviceChart', getResponseCounts(questions.explain_advice, yesNoSometimes));
    createPieChart('partnerProblemsChart', getResponseCounts(questions.partner_problems, yesNoSometimes));
    createBarChart('managersChart', getResponseCounts(questions.managers_helpful, yesNoSometimes));

    // Patient Relations Charts
    createDoughnutChart('patientBehaviorChart', getResponseCounts(questions.patient_behavior, yesNoSometimes));
    createPieChart('patientTrustChart', getResponseCounts(questions.patient_trust, yesNoSometimes));

    // Employee Satisfaction & Growth Charts
    createPieChart('safetyChart', getResponseCounts(questions.feel_safe, yesNoSometimes));
    createDoughnutChart('proudChart', getResponseCounts(questions.proud_of_work, yesNoSometimes));
    createBarChart('targetChart', getResponseCounts(questions.monthly_target, yesNoSometimes));
    createPieChart('careerGrowthChart', getResponseCounts(questions.career_growth, yesNoSometimes));
    createBarChart('trainingChart', getResponseCounts(questions.additional_training,
        ['Yes', 'No', 'Maybe later']));

    // NPS Distribution
    const recommendScores = {};
    for (let i = 1; i <= 10; i++) recommendScores[i] = 0;
    currentData.forEach(row => {
        const score = parseInt(row[questions.recommend_rating]);
        if (!isNaN(score) && score >= 1 && score <= 10) {
            recommendScores[score]++;
        }
    });

    createChart('recommendationChart', {
        type: 'bar',
        data: {
            labels: Object.keys(recommendScores),
            datasets: [{
                label: 'Number of Responses',
                data: Object.values(recommendScores),
                backgroundColor: '#667eea',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top' } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
                x: { title: { display: true, text: 'Combined English and Hindi responses analyzed.'} }
            }
        }
    });

    // Overall Radar
    const radarMetrics = {
        'Tablet': countYesResponses(questions.tablet_working),
        'Clean': countYesResponses(questions.clinic_clean),
        'Safe': countYesResponses(questions.feel_safe),
        'Medicines': countYesResponses(questions.medicines_available),
        'Managers': countYesResponses(questions.managers_helpful),
        'Proud': countYesResponses(questions.proud_of_work),
        'Patients': countYesResponses(questions.patient_trust),
        'Career': countYesResponses(questions.career_growth)
    };

    createChart('overallRadarChart', {
        type: 'radar',
        data: {
            labels: Object.keys(radarMetrics),
            datasets: [{
                label: 'Positive Responses (%)',
                data: Object.values(radarMetrics).map(count => (count / currentData.length * 100).toFixed(1)),
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 2,
                pointBackgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } }
        }
    });

    // Comparative Analysis
    const allMetrics = [
        'Tablet', 'Internet', 'Clean', 'Safe', 'Medicines',
        'Managers', 'Targets', 'Patients', 'Trust', 'Proud',
        'Career', 'Equipment'
    ];
    const allMetricsHindi = [
        'टैबलेट', 'इंटरनेट', 'साफ', 'सुरक्षित', 'दवाइयां',
        'प्रबंधक', 'लक्ष्य', 'रोगी', 'विश्वास', 'गर्व',
        'करियर', 'उपकरण'
    ];

    const comparativeData = [
        countYesResponses(questions.tablet_working),
        currentData.length - countResponses(questions.internet_problems, ['yes', 'sometimes', 'हाँ', 'कभी-कभी']),
        countYesResponses(questions.clinic_clean),
        countYesResponses(questions.feel_safe),
        countYesResponses(questions.medicines_available),
        countYesResponses(questions.managers_helpful),
        countYesResponses(questions.monthly_target),
        countYesResponses(questions.patient_behavior),
        countYesResponses(questions.patient_trust),
        countYesResponses(questions.proud_of_work),
        countYesResponses(questions.career_growth),
        countYesResponses(questions.equipment_working)
    ].map(count => (count / currentData.length * 100).toFixed(1));

    createChart('comparativeChart', {
        type: 'bar',
        data: {
            labels: currentLanguage === 'english' ? allMetrics : allMetricsHindi,
            datasets: [{
                label: 'Positive Response Rate (%)',
                data: comparativeData,
                backgroundColor: '#2563eb',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top' } },
            scales: { y: { beginAtZero: true, max: 100, ticks: { stepSize: 10 } } }
        }
    });
}

function createPieChart(canvasId, data) {
    // Skip if no data
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
        console.warn(`Skipping chart ${canvasId} - no data`);
        // Hide the chart container
        const chartElement = document.getElementById(canvasId);
        if (chartElement && chartElement.parentElement) {
            chartElement.parentElement.style.display = 'none';
        }
        return;
    }

    createChart(canvasId, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: (value, context) => {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function createDoughnutChart(canvasId, data) {
    // Skip if no data
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
        console.warn(`Skipping chart ${canvasId} - no data`);
        // Hide the chart container
        const chartElement = document.getElementById(canvasId);
        if (chartElement && chartElement.parentElement) {
            chartElement.parentElement.style.display = 'none';
        }
        return;
    }

    createChart(canvasId, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: (value, context) => {
                        return value;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function createBarChart(canvasId, data) {
    // Skip if no data
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
        console.warn(`Skipping chart ${canvasId} - no data`);
        // Hide the chart container
        const chartElement = document.getElementById(canvasId);
        if (chartElement && chartElement.parentElement) {
            chartElement.parentElement.style.display = 'none';
        }
        return;
    }

    createChart(canvasId, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Responses',
                data: Object.values(data),
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#1f2937',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: (value, context) => {
                        return value;
                    }
                }
            },
            scales: { y: { beginAtZero: true } }
        },
        plugins: [ChartDataLabels]
    });
}

function countYesResponses(question) {
    if (!question) return 0;
    return currentData.filter(row => {
        const answer = row[question];
        return answer && (answer.toLowerCase() === 'yes' || answer === 'हाँ');
    }).length;
}

function createChart(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (ctx) {
        const chart = new Chart(ctx, config);
        chartInstances.push(chart);
    }
}

// Export Functions
function initializeExportButtons() {
    document.getElementById('exportImage').addEventListener('click', exportAsImage);
    document.getElementById('exportCSV').addEventListener('click', exportAsCSV);
}

async function exportAsImage() {
    const dashboardContent = document.getElementById('dashboardContent');

    if (!currentData) {
        alert('Please upload data first!');
        return;
    }

    try {
        const canvas = await html2canvas(dashboardContent, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });

        const link = document.createElement('a');
        link.download = `nurse-feedback-dashboard-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error exporting image:', error);
        alert('Error exporting image. Please try again.');
    }
}

function exportAsCSV() {
    if (!currentData) {
        alert('Please upload data first!');
        return;
    }

    const headers = Object.keys(currentData[0]);
    const csvContent = [
        headers.join(','),
        ...currentData.map(row =>
            headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nurse-feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}
