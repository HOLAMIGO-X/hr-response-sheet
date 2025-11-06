// Global variables
let currentData = null;
let currentLanguage = 'english';
let chartInstances = [];

// Question mappings for English and Hindi
const questionMappings = {
    english: {
        timestamp: 'Timestamp',
        name: 'Name and Employee ID',
        tablet_working: 'Is the tablet working well for consultations?',
        internet_problems: 'Do you face internet problems during consultations?',
        tablet_knowledge: 'Do you know how to use the tablet?',
        quick_help: 'If tablet or internet has a problem, do you get help quickly?',
        doctor_respectful: 'Are the doctors nice and respectful during consultations?',
        partner_problems: 'Do you face any problems working with the partner staff in the clinic?  ',
        clinic_timings: 'Are you comfortable with the current clinic timings? ',
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
    },
    hindi: {
        timestamp: 'Timestamp',
        name: 'नाम  और  Employee ID ',
        tablet_working: 'क्या टैबलेट डॉक्टर से बात करने के लिए ठीक से काम कर रहा है? ',
        internet_problems: 'क्या आपको डॉक्टर से बात करते समय इंटरनेट संबंधी समस्याओं का सामना करना पड़ता है? ',
        tablet_knowledge: 'क्या आप टैबलेट का उपयोग करना जानते हैं? ',
        quick_help: 'यदि टैबलेट या इंटरनेट में कोई समस्या आती है तो क्या आपको तुरंत सहायता मिल जाती है? ',
        doctor_respectful: 'क्या डॉक्टर वीडियो कॉल पर अच्छे और सम्मानजनक हैं? ',
        explain_advice: 'क्या आप मरीज़ को डॉक्टर की सलाह स्पष्ट रूप से समझा सकते हैं? ',
        clinic_clean: 'क्या आपका क्लिनिक साफ-सुथरा और अच्छी स्थिति में है? ',
        feel_safe: 'क्या आप क्लिनिक में अकेले काम करते हुए सुरक्षित महसूस करते हैं? ',
        medicines_available: 'क्या आपको क्लिनिक में सभी आवश्यक दवाइयां मिल जाती हैं? ',
        managers_helpful: 'क्या आपका डीसी या फील्ड मैनेजर मददगार है? ',
        monthly_target: 'क्या आप अपना मासिक लक्ष्य पूरा कर पाते हैं? ',
        patient_behavior: 'क्या मरीज़ आपके साथ अच्छा व्यवहार करते हैं? ',
        patient_trust: 'क्या मरीज़ क्लिनिक में आप पर भरोसा करते हैं? ',
        camp_help: 'क्या आपको हेल्थ डायग्नोस्टिक कैंप्स के दौरान सहायता मिलती है? ',
        partner_problems: 'क्या आपको क्लिनिक में पार्टनर स्टाफ के साथ काम करने में कोई समस्या होती है?',
        clinic_timings: 'क्या आप क्लिनिक के समय से संतुष्ट हैं?',
        equipment_working: 'क्या पंखे,और लाइट सही से काम करते हैं?',
        additional_training: 'क्या आपको किसी अतिरिक्त प्रशिक्षण की आवश्यकता है? ',
        proud_of_work: 'क्या आपको अपने काम पर गर्व महसूस होता है? ',
        recommend_rating: 'क्या आप अपने किसी मित्र को यहां काम करने के लिए कहेंगे? (1 से 10 तक रेटिंग दें) ',
        career_growth: 'क्या आप एम-स्वस्थ में काम करते हुए अपने करियर में आगे बढ़ पा रहे हैं? ',
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFileUpload();
    initializeLanguageToggle();
    initializeExportButtons();
});

// File Upload Handling
function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.querySelector('.upload-box');

    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.innerHTML = `<strong>File:</strong> ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    fileInfo.classList.add('active');

    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
        reader.onload = (e) => {
            const text = e.target.result;
            parseCSV(text);
        };
        reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            processData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }
}

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }

    processData(data);
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function processData(data) {
    currentData = data;
    detectLanguage(data);
    renderDashboard();
}

function detectLanguage(data) {
    if (data.length > 0) {
        const firstRow = data[0];
        const columns = Object.keys(firstRow);

        // Check if columns contain Hindi characters
        const hasHindi = columns.some(col => /[\u0900-\u097F]/.test(col));
        currentLanguage = hasHindi ? 'hindi' : 'english';

        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === currentLanguage) {
                btn.classList.add('active');
            }
        });
    }
}

// Language Toggle
function initializeLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Note: In real implementation, you would switch between different datasets
            alert('To switch languages, please upload the corresponding file (English or Hindi version)');
        });
    });
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
        ${renderCharts()}
        ${renderInsights()}
    `;

    dashboardContent.innerHTML = html;
    initializeCharts();
}

function renderStats() {
    const totalResponses = currentData.length;
    const questions = questionMappings[currentLanguage];

    // Calculate average recommendation score
    const recommendScores = currentData
        .map(row => parseFloat(row[questions.recommend_rating]))
        .filter(score => !isNaN(score));
    const avgRecommendation = recommendScores.length > 0
        ? (recommendScores.reduce((a, b) => a + b, 0) / recommendScores.length).toFixed(1)
        : 'N/A';

    // Calculate satisfaction rate (based on "Yes" responses)
    const satisfactionQuestions = [
        questions.tablet_working,
        questions.clinic_clean,
        questions.feel_safe,
        questions.proud_of_work
    ];

    let totalPositive = 0;
    let totalAnswers = 0;

    satisfactionQuestions.forEach(q => {
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

    return `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>${currentLanguage === 'english' ? 'Total Responses' : 'कुल प्रतिक्रियाएं'}</h3>
                <div class="value">${totalResponses}</div>
                <div class="label">${currentLanguage === 'english' ? 'Feedback Submissions' : 'फीडबैक सबमिशन'}</div>
            </div>
            <div class="stat-card">
                <h3>${currentLanguage === 'english' ? 'Average Recommendation Score' : 'औसत सिफारिश स्कोर'}</h3>
                <div class="value">${avgRecommendation}/10</div>
                <div class="label">${currentLanguage === 'english' ? 'Net Promoter Score' : 'नेट प्रमोटर स्कोर'}</div>
            </div>
            <div class="stat-card">
                <h3>${currentLanguage === 'english' ? 'Overall Satisfaction' : 'समग्र संतुष्टि'}</h3>
                <div class="value">${satisfactionRate}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Positive Responses' : 'सकारात्मक प्रतिक्रियाएं'}</div>
            </div>
            <div class="stat-card">
                <h3>${currentLanguage === 'english' ? 'Data Quality' : 'डेटा गुणवत्ता'}</h3>
                <div class="value">${((recommendScores.length / totalResponses) * 100).toFixed(0)}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Complete Responses' : 'पूर्ण प्रतिक्रियाएं'}</div>
            </div>
        </div>
    `;
}

function renderCharts() {
    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <h2>${currentLanguage === 'english' ? 'Visual Analytics' : 'दृश्य विश्लेषण'}</h2>
        </div>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Tablet & Internet Issues' : 'टैबलेट और इंटरनेट समस्याएं'}</h3>
                <div class="chart-wrapper">
                    <canvas id="tabletChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Workplace Safety & Comfort' : 'कार्यस्थल सुरक्षा और आराम'}</h3>
                <div class="chart-wrapper">
                    <canvas id="safetyChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Support & Resources' : 'समर्थन और संसाधन'}</h3>
                <div class="chart-wrapper">
                    <canvas id="supportChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Patient Interaction' : 'रोगी सहभागिता'}</h3>
                <div class="chart-wrapper">
                    <canvas id="patientChart"></canvas>
                </div>
            </div>
            <div class="chart-container full-width-chart">
                <h3>${currentLanguage === 'english' ? 'Recommendation Score Distribution' : 'सिफारिश स्कोर वितरण'}</h3>
                <div class="chart-wrapper">
                    <canvas id="recommendationChart"></canvas>
                </div>
            </div>
            <div class="chart-container full-width-chart">
                <h3>${currentLanguage === 'english' ? 'Overall Satisfaction Metrics' : 'समग्र संतुष्टि मेट्रिक्स'}</h3>
                <div class="chart-wrapper">
                    <canvas id="overallChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function renderInsights() {
    const questions = questionMappings[currentLanguage];

    // Calculate insights
    const internetIssues = countResponses(questions.internet_problems, ['sometimes', 'yes', 'कभी-कभी', 'हाँ']);
    const needsTraining = countResponses(questions.additional_training, ['yes', 'maybe later', 'हाँ', 'शायद बाद में']);
    const targetCompleted = countResponses(questions.monthly_target, ['yes', 'हाँ']);

    const insights = [];

    if (internetIssues > currentData.length * 0.3) {
        insights.push({
            type: 'warning',
            title: currentLanguage === 'english' ? 'Internet Connectivity Concerns' : 'इंटरनेट कनेक्टिविटी संबंधी चिंताएं',
            text: currentLanguage === 'english'
                ? `${((internetIssues / currentData.length) * 100).toFixed(0)}% of nurses report internet issues during consultations.`
                : `${((internetIssues / currentData.length) * 100).toFixed(0)}% नर्सें परामर्श के दौरान इंटरनेट समस्याओं की रिपोर्ट करती हैं।`
        });
    }

    if (needsTraining > 0) {
        insights.push({
            type: 'warning',
            title: currentLanguage === 'english' ? 'Training Requirements' : 'प्रशिक्षण आवश्यकताएं',
            text: currentLanguage === 'english'
                ? `${needsTraining} nurses have requested additional training.`
                : `${needsTraining} नर्सों ने अतिरिक्त प्रशिक्षण का अनुरोध किया है।`
        });
    }

    if (targetCompleted > currentData.length * 0.7) {
        insights.push({
            type: 'success',
            title: currentLanguage === 'english' ? 'Strong Performance' : 'मजबूत प्रदर्शन',
            text: currentLanguage === 'english'
                ? `${((targetCompleted / currentData.length) * 100).toFixed(0)}% of nurses are meeting their monthly targets.`
                : `${((targetCompleted / currentData.length) * 100).toFixed(0)}% नर्सें अपने मासिक लक्ष्यों को पूरा कर रही हैं।`
        });
    }

    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h2>${currentLanguage === 'english' ? 'Key Insights' : 'मुख्य अंतर्दृष्टि'}</h2>
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
    return currentData.filter(row => {
        const answer = row[question];
        if (!answer) return false;
        const normalizedAnswer = answer.toString().toLowerCase().trim();
        return targetValues.some(val => normalizedAnswer.includes(val.toLowerCase()));
    }).length;
}

function getResponseCounts(question, possibleAnswers) {
    const counts = {};
    possibleAnswers.forEach(answer => counts[answer] = 0);

    currentData.forEach(row => {
        const answer = row[question];
        if (answer) {
            const normalizedAnswer = answer.toString().trim();
            possibleAnswers.forEach(possible => {
                if (normalizedAnswer.toLowerCase() === possible.toLowerCase() ||
                    normalizedAnswer === possible) {
                    counts[possible]++;
                }
            });
        }
    });

    return counts;
}

function initializeCharts() {
    const questions = questionMappings[currentLanguage];

    // Chart 1: Tablet & Internet Issues
    const tabletData = currentLanguage === 'english'
        ? getResponseCounts(questions.internet_problems, ['Yes', 'No', 'Sometimes'])
        : getResponseCounts(questions.internet_problems, ['हाँ', 'नहीं', 'कभी-कभी']);

    createChart('tabletChart', {
        type: 'doughnut',
        data: {
            labels: Object.keys(tabletData),
            datasets: [{
                data: Object.values(tabletData),
                backgroundColor: ['#ef4444', '#10b981', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Chart 2: Safety & Comfort
    const safetyData = currentLanguage === 'english'
        ? getResponseCounts(questions.feel_safe, ['Yes', 'No', 'Sometimes'])
        : getResponseCounts(questions.feel_safe, ['हाँ', 'नहीं', 'कभी-कभी']);

    createChart('safetyChart', {
        type: 'pie',
        data: {
            labels: Object.keys(safetyData),
            datasets: [{
                data: Object.values(safetyData),
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Chart 3: Support & Resources
    const supportData = currentLanguage === 'english'
        ? getResponseCounts(questions.medicines_available, ['Yes', 'No', 'Sometimes'])
        : getResponseCounts(questions.medicines_available, ['हाँ', 'नहीं', 'कभी-कभी']);

    createChart('supportChart', {
        type: 'bar',
        data: {
            labels: Object.keys(supportData),
            datasets: [{
                label: currentLanguage === 'english' ? 'Responses' : 'प्रतिक्रियाएं',
                data: Object.values(supportData),
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Chart 4: Patient Interaction
    const patientData = currentLanguage === 'english'
        ? getResponseCounts(questions.patient_trust, ['Yes', 'No', 'Sometimes'])
        : getResponseCounts(questions.patient_trust, ['हाँ', 'नहीं', 'कभी-कभी']);

    createChart('patientChart', {
        type: 'bar',
        data: {
            labels: Object.keys(patientData),
            datasets: [{
                label: currentLanguage === 'english' ? 'Responses' : 'प्रतिक्रियाएं',
                data: Object.values(patientData),
                backgroundColor: '#2563eb',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });

    // Chart 5: Recommendation Score Distribution
    const recommendScores = {};
    for (let i = 1; i <= 10; i++) {
        recommendScores[i] = 0;
    }

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
                label: currentLanguage === 'english' ? 'Number of Responses' : 'प्रतिक्रियाओं की संख्या',
                data: Object.values(recommendScores),
                backgroundColor: '#667eea',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: currentLanguage === 'english' ? 'Rating (1-10)' : 'रेटिंग (1-10)'
                    }
                }
            }
        }
    });

    // Chart 6: Overall Satisfaction Metrics
    const satisfactionMetrics = {
        [currentLanguage === 'english' ? 'Tablet Working' : 'टैबलेट काम कर रहा']: countYesResponses(questions.tablet_working),
        [currentLanguage === 'english' ? 'Clinic Clean' : 'क्लिनिक साफ']: countYesResponses(questions.clinic_clean),
        [currentLanguage === 'english' ? 'Feel Safe' : 'सुरक्षित महसूस']: countYesResponses(questions.feel_safe),
        [currentLanguage === 'english' ? 'Medicines Available' : 'दवाइयां उपलब्ध']: countYesResponses(questions.medicines_available),
        [currentLanguage === 'english' ? 'Managers Helpful' : 'प्रबंधक सहायक']: countYesResponses(questions.managers_helpful),
        [currentLanguage === 'english' ? 'Proud of Work' : 'काम पर गर्व']: countYesResponses(questions.proud_of_work)
    };

    createChart('overallChart', {
        type: 'radar',
        data: {
            labels: Object.keys(satisfactionMetrics),
            datasets: [{
                label: currentLanguage === 'english' ? 'Positive Responses (%)' : 'सकारात्मक प्रतिक्रियाएं (%)',
                data: Object.values(satisfactionMetrics).map(count => (count / currentData.length * 100).toFixed(1)),
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
                borderWidth: 2,
                pointBackgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
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
        alert(currentLanguage === 'english'
            ? 'Please upload data first!'
            : 'कृपया पहले डेटा अपलोड करें!');
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
        alert(currentLanguage === 'english'
            ? 'Please upload data first!'
            : 'कृपया पहले डेटा अपलोड करें!');
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
