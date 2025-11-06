// Global variables
let currentData = null;
let currentLanguage = 'english';
let chartInstances = [];

// Comprehensive question mappings for English and Hindi
const questionMappings = {
    english: {
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
        management_feedback: 'Any feedback for the management'
    },
    hindi: {
        timestamp: 'Timestamp',
        email: 'Email address',
        name: 'नाम  और  Employee ID ',
        tablet_working: 'क्या टैबलेट डॉक्टर से बात करने के लिए ठीक से काम कर रहा है? ',
        internet_problems: 'क्या आपको डॉक्टर से बात करते समय इंटरनेट संबंधी समस्याओं का सामना करना पड़ता है? ',
        tablet_knowledge: 'क्या आप टैबलेट का उपयोग करना जानते हैं? ',
        quick_help: 'यदि टैबलेट या इंटरनेट में कोई समस्या आती है तो क्या आपको तुरंत सहायता मिल जाती है? ',
        doctor_respectful: 'क्या डॉक्टर वीडियो कॉल पर अच्छे और सम्मानजनक हैं? ',
        explain_advice: 'क्या आप मरीज़ को डॉक्टर की सलाह स्पष्ट रूप से समझा सकते हैं? ',
        clinic_clean: 'क्या आपका क्लिनिक साफ-सुथरा और अच्छी स्थिति में है? ',
        equipment_working: 'क्या पंखे,और लाइट सही से काम करते हैं?',
        feel_safe: 'क्या आप क्लिनिक में अकेले काम करते हुए सुरक्षित महसूस करते हैं? ',
        medicines_available: 'क्या आपको क्लिनिक में सभी आवश्यक दवाइयां मिल जाती हैं? ',
        managers_helpful: 'क्या आपका डीसी या फील्ड मैनेजर मददगार है? ',
        monthly_target: 'क्या आप अपना मासिक लक्ष्य पूरा कर पाते हैं? ',
        patient_behavior: 'क्या मरीज़ आपके साथ अच्छा व्यवहार करते हैं? ',
        patient_trust: 'क्या मरीज़ क्लिनिक में आप पर भरोसा करते हैं? ',
        camp_help: 'क्या आपको हेल्थ डायग्नोस्टिक कैंप्स के दौरान सहायता मिलती है? ',
        partner_problems: 'क्या आपको क्लिनिक में पार्टनर स्टाफ के साथ काम करने में कोई समस्या होती है?',
        clinic_timings: 'क्या आप क्लिनिक के समय से संतुष्ट हैं?',
        timing_changes: 'यदि नहीं, तो कृपया हमें बताएं कि क्लिनिक के समय में क्या बदलाव आपके कार्य को बेहतर बनाने में मदद करेंगे?',
        tablet_training: 'क्या आपको टैबलेट का उपयोग करने और क्लिनिक में काम करने का प्रशिक्षण मिला था? ',
        additional_training: 'क्या आपको किसी अतिरिक्त प्रशिक्षण की आवश्यकता है? ',
        proud_of_work: 'क्या आपको अपने काम पर गर्व महसूस होता है? ',
        recommend_rating: 'क्या आप अपने किसी मित्र को यहां काम करने के लिए कहेंगे? (1 से 10 तक रेटिंग दें) ',
        career_growth: 'क्या आप एम-स्वस्थ में काम करते हुए अपने करियर में आगे बढ़ पा रहे हैं? ',
        additional_help: 'क्या आपको बेहतर काम करने के लिए किसी अतिरिक्त सहायता की आवश्यकता है? ',
        clinic_improvements: 'ऐसी चीजें जो आपके क्लिनिक को बेहतर बना सकती हैं: ',
        management_feedback: 'प्रबंधन को कोई प्रतिक्रिया: '
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFileUpload();
    initializeLanguageToggle();
    initializeExportButtons();

    // Auto-load embedded data if available
    if (typeof embeddedData !== 'undefined') {
        console.log('Embedded data found, loading English data by default');
        processData(embeddedData.english);

        // Update file info
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.innerHTML = '<strong>Data:</strong> English Version (95 responses) - Pre-loaded';
        fileInfo.classList.add('active');
    }
});

// File Upload Handling
function initializeFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.querySelector('.upload-box');

    fileInput.addEventListener('change', handleFileSelect);

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
        const hasHindi = columns.some(col => /[\u0900-\u097F]/.test(col));
        currentLanguage = hasHindi ? 'hindi' : 'english';

        // Debug: Log detected columns
        console.log('Detected Language:', currentLanguage);
        console.log('Available Columns:', columns);

        // Verify key mappings exist
        const questions = questionMappings[currentLanguage];
        const missingMappings = [];
        Object.keys(questions).forEach(key => {
            const columnName = questions[key];
            if (columnName && !columns.includes(columnName)) {
                // Try to find similar column
                const similar = columns.find(col =>
                    col.toLowerCase().includes(columnName.toLowerCase().substring(0, 20)) ||
                    columnName.toLowerCase().includes(col.toLowerCase().substring(0, 20))
                );
                if (similar) {
                    console.log(`Mapping mismatch for ${key}: Expected "${columnName}", found similar "${similar}"`);
                } else {
                    missingMappings.push({key, expected: columnName});
                }
            }
        });

        if (missingMappings.length > 0) {
            console.warn('Missing column mappings:', missingMappings);
        }

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
            const selectedLang = btn.dataset.lang;

            // Check if embedded data is available
            if (typeof embeddedData !== 'undefined') {
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Load the corresponding embedded data
                if (selectedLang === 'english') {
                    processData(embeddedData.english);
                    const fileInfo = document.getElementById('fileInfo');
                    fileInfo.innerHTML = '<strong>Data:</strong> English Version (95 responses) - Pre-loaded';
                    fileInfo.classList.add('active');
                } else if (selectedLang === 'hindi') {
                    processData(embeddedData.hindi);
                    const fileInfo = document.getElementById('fileInfo');
                    fileInfo.innerHTML = '<strong>Data:</strong> Hindi Version (121 responses) - Pre-loaded';
                    fileInfo.classList.add('active');
                }
            } else {
                // If no embedded data, show upload message
                alert('To switch languages, please upload the corresponding file (English or Hindi version)');
            }
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
        ${renderAllCharts()}
        ${renderDetailedTables()}
        ${renderInsights()}
        ${renderTextAnalysis()}
    `;

    dashboardContent.innerHTML = html;
    initializeAllCharts();
}

function renderStats() {
    const totalResponses = currentData.length;
    const questions = questionMappings[currentLanguage];

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
                <h3>${currentLanguage === 'english' ? 'Total Responses' : 'कुल प्रतिक्रियाएं'}</h3>
                <div class="value">${totalResponses}</div>
                <div class="label">${currentLanguage === 'english' ? 'Feedback Submissions' : 'फीडबैक सबमिशन'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <h3>${currentLanguage === 'english' ? 'NPS Score' : 'एनपीएस स्कोर'}</h3>
                <div class="value">${avgRecommendation}/10</div>
                <div class="label">${currentLanguage === 'english' ? 'Average Recommendation' : 'औसत सिफारिश'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <h3>${currentLanguage === 'english' ? 'Satisfaction Rate' : 'संतुष्टि दर'}</h3>
                <div class="value">${satisfactionRate}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Positive Responses' : 'सकारात्मक उत्तर'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <h3>${currentLanguage === 'english' ? 'Target Achievement' : 'लक्ष्य उपलब्धि'}</h3>
                <div class="value">${targetPercentage}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Meeting Monthly Targets' : 'मासिक लक्ष्य पूरा'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <h3>${currentLanguage === 'english' ? 'Training Needs' : 'प्रशिक्षण आवश्यकता'}</h3>
                <div class="value">${trainingPercentage}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Need Additional Training' : 'अतिरिक्त प्रशिक्षण चाहिए'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
                <h3>${currentLanguage === 'english' ? 'Internet Issues' : 'इंटरनेट समस्याएं'}</h3>
                <div class="value">${internetPercentage}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Face Connectivity Issues' : 'कनेक्टिविटी समस्याएं'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                <h3>${currentLanguage === 'english' ? 'Career Growth' : 'करियर विकास'}</h3>
                <div class="value">${careerPercentage}%</div>
                <div class="label">${currentLanguage === 'english' ? 'See Career Growth' : 'करियर विकास देखते हैं'}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);">
                <h3>${currentLanguage === 'english' ? 'Data Quality' : 'डेटा गुणवत्ता'}</h3>
                <div class="value">${((recommendScores.length / totalResponses) * 100).toFixed(0)}%</div>
                <div class="label">${currentLanguage === 'english' ? 'Complete Responses' : 'पूर्ण प्रतिक्रियाएं'}</div>
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
            <h2>${currentLanguage === 'english' ? 'Comprehensive Visual Analytics' : 'व्यापक दृश्य विश्लेषण'}</h2>
        </div>

        <!-- Technology & Infrastructure -->
        <h3 class="category-title">${currentLanguage === 'english' ? '💻 Technology & Infrastructure' : '💻 प्रौद्योगिकी और बुनियादी ढांचा'}</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Tablet Functionality' : 'टैबलेट कार्यक्षमता'}</h3>
                <div class="chart-wrapper"><canvas id="tabletWorkingChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Internet Connectivity Issues' : 'इंटरनेट कनेक्टिविटी समस्याएं'}</h3>
                <div class="chart-wrapper"><canvas id="internetProblemsChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Tablet Usage Knowledge' : 'टैबलेट उपयोग ज्ञान'}</h3>
                <div class="chart-wrapper"><canvas id="tabletKnowledgeChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Technical Support Response' : 'तकनीकी सहायता प्रतिक्रिया'}</h3>
                <div class="chart-wrapper"><canvas id="quickHelpChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Equipment Status' : 'उपकरण स्थिति'}</h3>
                <div class="chart-wrapper"><canvas id="equipmentChart"></canvas></div>
            </div>
        </div>

        <!-- Clinical Operations -->
        <h3 class="category-title">${currentLanguage === 'english' ? '🏥 Clinical Operations' : '🏥 नैदानिक ​​संचालन'}</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Clinic Cleanliness & Condition' : 'क्लिनिक स्वच्छता और स्थिति'}</h3>
                <div class="chart-wrapper"><canvas id="clinicCleanChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Medicine Availability' : 'दवा उपलब्धता'}</h3>
                <div class="chart-wrapper"><canvas id="medicinesChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Clinic Timing Satisfaction' : 'क्लिनिक समय संतुष्टि'}</h3>
                <div class="chart-wrapper"><canvas id="timingChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Diagnostic Camp Support' : 'डायग्नोस्टिक कैंप सहायता'}</h3>
                <div class="chart-wrapper"><canvas id="campHelpChart"></canvas></div>
            </div>
        </div>

        <!-- Doctor & Team Interaction -->
        <h3 class="category-title">${currentLanguage === 'english' ? '👨‍⚕️ Doctor & Team Interaction' : '👨‍⚕️ डॉक्टर और टीम संपर्क'}</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Doctor Behavior & Respect' : 'डॉक्टर व्यवहार और सम्मान'}</h3>
                <div class="chart-wrapper"><canvas id="doctorRespectChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Advice Communication Clarity' : 'सलाह संचार स्पष्टता'}</h3>
                <div class="chart-wrapper"><canvas id="explainAdviceChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Partner Staff Collaboration' : 'पार्टनर स्टाफ सहयोग'}</h3>
                <div class="chart-wrapper"><canvas id="partnerProblemsChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Manager Helpfulness' : 'प्रबंधक सहायता'}</h3>
                <div class="chart-wrapper"><canvas id="managersChart"></canvas></div>
            </div>
        </div>

        <!-- Patient Relations -->
        <h3 class="category-title">${currentLanguage === 'english' ? '🤝 Patient Relations' : '🤝 रोगी संबंध'}</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Patient Behavior' : 'रोगी व्यवहार'}</h3>
                <div class="chart-wrapper"><canvas id="patientBehaviorChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Patient Trust Levels' : 'रोगी विश्वास स्तर'}</h3>
                <div class="chart-wrapper"><canvas id="patientTrustChart"></canvas></div>
            </div>
        </div>

        <!-- Employee Satisfaction & Growth -->
        <h3 class="category-title">${currentLanguage === 'english' ? '📈 Employee Satisfaction & Growth' : '📈 कर्मचारी संतुष्टि और विकास'}</h3>
        <div class="chart-grid">
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Workplace Safety Perception' : 'कार्यस्थल सुरक्षा धारणा'}</h3>
                <div class="chart-wrapper"><canvas id="safetyChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Work Pride & Satisfaction' : 'काम का गर्व और संतुष्टि'}</h3>
                <div class="chart-wrapper"><canvas id="proudChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Monthly Target Achievement' : 'मासिक लक्ष्य उपलब्धि'}</h3>
                <div class="chart-wrapper"><canvas id="targetChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Career Growth Perception' : 'करियर विकास धारणा'}</h3>
                <div class="chart-wrapper"><canvas id="careerGrowthChart"></canvas></div>
            </div>
            <div class="chart-container">
                <h3>${currentLanguage === 'english' ? 'Training Requirements' : 'प्रशिक्षण आवश्यकताएं'}</h3>
                <div class="chart-wrapper"><canvas id="trainingChart"></canvas></div>
            </div>
        </div>

        <!-- NPS & Overall -->
        <h3 class="category-title">${currentLanguage === 'english' ? '⭐ Net Promoter Score & Overall Metrics' : '⭐ नेट प्रमोटर स्कोर और समग्र मेट्रिक्स'}</h3>
        <div class="chart-grid">
            <div class="chart-container full-width-chart">
                <h3>${currentLanguage === 'english' ? 'Recommendation Score Distribution (NPS)' : 'सिफारिश स्कोर वितरण (एनपीएस)'}</h3>
                <div class="chart-wrapper"><canvas id="recommendationChart"></canvas></div>
            </div>
            <div class="chart-container full-width-chart">
                <h3>${currentLanguage === 'english' ? 'Overall Satisfaction Radar' : 'समग्र संतुष्टि रडार'}</h3>
                <div class="chart-wrapper"><canvas id="overallRadarChart"></canvas></div>
            </div>
            <div class="chart-container full-width-chart">
                <h3>${currentLanguage === 'english' ? 'Comparative Analysis - All Metrics' : 'तुलनात्मक विश्लेषण - सभी मेट्रिक्स'}</h3>
                <div class="chart-wrapper"><canvas id="comparativeChart"></canvas></div>
            </div>
        </div>
    `;
}

function renderDetailedTables() {
    const questions = questionMappings[currentLanguage];

    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <h2>${currentLanguage === 'english' ? 'Detailed Data Tables' : 'विस्तृत डेटा तालिकाएं'}</h2>
        </div>

        ${renderResponseSummaryTable()}
        ${renderTopFeedbackTable()}
        ${renderNPSBreakdownTable()}
    `;
}

function renderResponseSummaryTable() {
    const questions = questionMappings[currentLanguage];

    const summaryData = [
        { question: currentLanguage === 'english' ? 'Tablet Working' : 'टैबलेट काम कर रहा', key: questions.tablet_working },
        { question: currentLanguage === 'english' ? 'Internet Problems' : 'इंटरनेट समस्याएं', key: questions.internet_problems },
        { question: currentLanguage === 'english' ? 'Clinic Clean' : 'क्लिनिक साफ', key: questions.clinic_clean },
        { question: currentLanguage === 'english' ? 'Feel Safe' : 'सुरक्षित महसूस', key: questions.feel_safe },
        { question: currentLanguage === 'english' ? 'Medicines Available' : 'दवाइयां उपलब्ध', key: questions.medicines_available },
        { question: currentLanguage === 'english' ? 'Managers Helpful' : 'प्रबंधक सहायक', key: questions.managers_helpful },
        { question: currentLanguage === 'english' ? 'Monthly Target' : 'मासिक लक्ष्य', key: questions.monthly_target },
        { question: currentLanguage === 'english' ? 'Patient Behavior' : 'रोगी व्यवहार', key: questions.patient_behavior },
        { question: currentLanguage === 'english' ? 'Patient Trust' : 'रोगी विश्वास', key: questions.patient_trust },
        { question: currentLanguage === 'english' ? 'Proud of Work' : 'काम पर गर्व', key: questions.proud_of_work },
        { question: currentLanguage === 'english' ? 'Career Growth' : 'करियर विकास', key: questions.career_growth }
    ];

    let tableRows = '';
    summaryData.forEach(item => {
        if (item.key) {
            const counts = getResponseCounts(item.key,
                currentLanguage === 'english' ? ['Yes', 'No', 'Sometimes'] : ['हाँ', 'नहीं', 'कभी-कभी']);
            const total = Object.values(counts).reduce((a, b) => a + b, 0);
            const yesPercent = total > 0 ? ((counts[currentLanguage === 'english' ? 'Yes' : 'हाँ'] / total) * 100).toFixed(1) : 0;

            tableRows += `
                <tr>
                    <td><strong>${item.question}</strong></td>
                    <td>${counts[currentLanguage === 'english' ? 'Yes' : 'हाँ'] || 0}</td>
                    <td>${counts[currentLanguage === 'english' ? 'No' : 'नहीं'] || 0}</td>
                    <td>${counts[currentLanguage === 'english' ? 'Sometimes' : 'कभी-कभी'] || 0}</td>
                    <td><span class="sentiment-${yesPercent > 70 ? 'positive' : yesPercent > 40 ? 'neutral' : 'negative'}">${yesPercent}%</span></td>
                </tr>
            `;
        }
    });

    return `
        <div class="table-section">
            <h3>${currentLanguage === 'english' ? 'Response Summary by Question' : 'प्रश्न द्वारा प्रतिक्रिया सारांश'}</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>${currentLanguage === 'english' ? 'Question' : 'प्रश्न'}</th>
                        <th>${currentLanguage === 'english' ? 'Yes' : 'हाँ'}</th>
                        <th>${currentLanguage === 'english' ? 'No' : 'नहीं'}</th>
                        <th>${currentLanguage === 'english' ? 'Sometimes' : 'कभी-कभी'}</th>
                        <th>${currentLanguage === 'english' ? 'Positive %' : 'सकारात्मक %'}</th>
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
    const questions = questionMappings[currentLanguage];

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
            <h3>${currentLanguage === 'english' ? 'Management Feedback Highlights' : 'प्रबंधन फीडबैक हाइलाइट्स'}</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>${currentLanguage === 'english' ? 'Employee' : 'कर्मचारी'}</th>
                        <th>${currentLanguage === 'english' ? 'Feedback' : 'फीडबैक'}</th>
                        <th>${currentLanguage === 'english' ? 'NPS' : 'एनपीएस'}</th>
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
    const questions = questionMappings[currentLanguage];

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
            <h3>${currentLanguage === 'english' ? 'Net Promoter Score (NPS) Breakdown' : 'नेट प्रमोटर स्कोर (एनपीएस) विवरण'}</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>${currentLanguage === 'english' ? 'Category' : 'श्रेणी'}</th>
                        <th>${currentLanguage === 'english' ? 'Score Range' : 'स्कोर रेंज'}</th>
                        <th>${currentLanguage === 'english' ? 'Count' : 'गिनती'}</th>
                        <th>${currentLanguage === 'english' ? 'Percentage' : 'प्रतिशत'}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="sentiment-positive">${currentLanguage === 'english' ? 'Promoters' : 'प्रमोटर्स'}</span></td>
                        <td>9-10</td>
                        <td>${npsData.promoters}</td>
                        <td>${total > 0 ? ((npsData.promoters / total) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td><span class="sentiment-neutral">${currentLanguage === 'english' ? 'Passives' : 'पैसिव'}</span></td>
                        <td>7-8</td>
                        <td>${npsData.passives}</td>
                        <td>${total > 0 ? ((npsData.passives / total) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                        <td><span class="sentiment-negative">${currentLanguage === 'english' ? 'Detractors' : 'डिट्रैक्टर्स'}</span></td>
                        <td>1-6</td>
                        <td>${npsData.detractors}</td>
                        <td>${total > 0 ? ((npsData.detractors / total) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr style="background: #f0f9ff; font-weight: bold;">
                        <td colspan="3">${currentLanguage === 'english' ? 'Net Promoter Score' : 'नेट प्रमोटर स्कोर'}</td>
                        <td><span class="sentiment-${npsScore > 50 ? 'positive' : npsScore > 0 ? 'neutral' : 'negative'}">${npsScore}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderTextAnalysis() {
    const questions = questionMappings[currentLanguage];

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
            <h2>${currentLanguage === 'english' ? 'Qualitative Feedback Analysis' : 'गुणात्मक फीडबैक विश्लेषण'}</h2>
        </div>

        <div class="insights-grid">
            <div class="insight-card">
                <h4>${currentLanguage === 'english' ? 'Clinic Improvement Suggestions' : 'क्लिनिक सुधार सुझाव'}</h4>
                <ul style="margin-top: 10px; color: #4b5563;">
                    ${improvements.map(row => `<li>${row[questions.clinic_improvements]}</li>`).join('')}
                </ul>
            </div>
            <div class="insight-card">
                <h4>${currentLanguage === 'english' ? 'Additional Help Requested' : 'अतिरिक्त सहायता का अनुरोध'}</h4>
                <ul style="margin-top: 10px; color: #4b5563;">
                    ${additionalHelp.map(row => `<li>${row[questions.additional_help]}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function renderInsights() {
    const questions = questionMappings[currentLanguage];

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
            title: currentLanguage === 'english' ? '⚠️ Internet Connectivity Concerns' : '⚠️ इंटरनेट कनेक्टिविटी चिंताएं',
            text: currentLanguage === 'english'
                ? `${((internetIssues / currentData.length) * 100).toFixed(0)}% of nurses report internet issues during consultations. This requires immediate attention.`
                : `${((internetIssues / currentData.length) * 100).toFixed(0)}% नर्सें परामर्श के दौरान इंटरनेट समस्याओं की रिपोर्ट करती हैं। इस पर तुरंत ध्यान देने की आवश्यकता है।`
        });
    }

    if (needsTraining > 0) {
        insights.push({
            type: 'warning',
            title: currentLanguage === 'english' ? '📚 Training Gap Identified' : '📚 प्रशिक्षण अंतर की पहचान',
            text: currentLanguage === 'english'
                ? `${needsTraining} nurses (${((needsTraining / currentData.length) * 100).toFixed(0)}%) have requested additional training.`
                : `${needsTraining} नर्सों (${((needsTraining / currentData.length) * 100).toFixed(0)}%) ने अतिरिक्त प्रशिक्षण का अनुरोध किया है।`
        });
    }

    if (targetCompleted > currentData.length * 0.7) {
        insights.push({
            type: 'success',
            title: currentLanguage === 'english' ? '✅ Excellent Performance' : '✅ उत्कृष्ट प्रदर्शन',
            text: currentLanguage === 'english'
                ? `${((targetCompleted / currentData.length) * 100).toFixed(0)}% of nurses are successfully meeting their monthly targets.`
                : `${((targetCompleted / currentData.length) * 100).toFixed(0)}% नर्सें अपने मासिक लक्ष्यों को सफलतापूर्वक पूरा कर रही हैं।`
        });
    }

    if (feelSafe > currentData.length * 0.8) {
        insights.push({
            type: 'success',
            title: currentLanguage === 'english' ? '🛡️ Strong Safety Perception' : '🛡️ मजबूत सुरक्षा धारणा',
            text: currentLanguage === 'english'
                ? `${((feelSafe / currentData.length) * 100).toFixed(0)}% of nurses feel safe working alone in the clinic.`
                : `${((feelSafe / currentData.length) * 100).toFixed(0)}% नर्सें क्लिनिक में अकेले काम करते हुए सुरक्षित महसूस करती हैं।`
        });
    }

    if (medicinesAvailable < currentData.length * 0.7) {
        insights.push({
            type: 'warning',
            title: currentLanguage === 'english' ? '💊 Medicine Availability Issue' : '💊 दवा उपलब्धता समस्या',
            text: currentLanguage === 'english'
                ? `Only ${((medicinesAvailable / currentData.length) * 100).toFixed(0)}% report having all necessary medicines available.`
                : `केवल ${((medicinesAvailable / currentData.length) * 100).toFixed(0)}% रिपोर्ट करती हैं कि सभी आवश्यक दवाइयां उपलब्ध हैं।`
        });
    }

    if (careerGrowth > currentData.length * 0.6) {
        insights.push({
            type: 'success',
            title: currentLanguage === 'english' ? '📈 Positive Career Outlook' : '📈 सकारात्मक करियर दृष्टिकोण',
            text: currentLanguage === 'english'
                ? `${((careerGrowth / currentData.length) * 100).toFixed(0)}% believe they can grow their career at M-Swasth.`
                : `${((careerGrowth / currentData.length) * 100).toFixed(0)}% का मानना है कि वे एम-स्वस्थ में अपना करियर बढ़ा सकती हैं।`
        });
    }

    return `
        <div class="section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h2>${currentLanguage === 'english' ? 'Key Insights & Recommendations' : 'मुख्य अंतर्दृष्टि और सिफारिशें'}</h2>
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

    // If question is undefined or null, return empty counts
    if (!question) {
        console.warn('Question is undefined, returning empty counts');
        return counts;
    }

    currentData.forEach(row => {
        const answer = row[question];
        if (answer) {
            const normalizedAnswer = String(answer).trim();
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

function initializeAllCharts() {
    const questions = questionMappings[currentLanguage];
    const yesNoSometimes = currentLanguage === 'english' ? ['Yes', 'No', 'Sometimes'] : ['हाँ', 'नहीं', 'कभी-कभी'];

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
        currentLanguage === 'english' ? ['Yes', 'No', 'Maybe later'] : ['हाँ', 'नहीं', 'शायद बाद में']));

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
                label: currentLanguage === 'english' ? 'Number of Responses' : 'प्रतिक्रियाओं की संख्या',
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
                x: { title: { display: true, text: currentLanguage === 'english' ? 'Rating (1-10)' : 'रेटिंग (1-10)' } }
            }
        }
    });

    // Overall Radar
    const radarMetrics = {
        [currentLanguage === 'english' ? 'Tablet' : 'टैबलेट']: countYesResponses(questions.tablet_working),
        [currentLanguage === 'english' ? 'Clean' : 'साफ']: countYesResponses(questions.clinic_clean),
        [currentLanguage === 'english' ? 'Safe' : 'सुरक्षित']: countYesResponses(questions.feel_safe),
        [currentLanguage === 'english' ? 'Medicines' : 'दवाइयां']: countYesResponses(questions.medicines_available),
        [currentLanguage === 'english' ? 'Managers' : 'प्रबंधक']: countYesResponses(questions.managers_helpful),
        [currentLanguage === 'english' ? 'Proud' : 'गर्व']: countYesResponses(questions.proud_of_work),
        [currentLanguage === 'english' ? 'Patients' : 'रोगी']: countYesResponses(questions.patient_trust),
        [currentLanguage === 'english' ? 'Career' : 'करियर']: countYesResponses(questions.career_growth)
    };

    createChart('overallRadarChart', {
        type: 'radar',
        data: {
            labels: Object.keys(radarMetrics),
            datasets: [{
                label: currentLanguage === 'english' ? 'Positive Responses (%)' : 'सकारात्मक प्रतिक्रियाएं (%)',
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
                label: currentLanguage === 'english' ? 'Positive Response Rate (%)' : 'सकारात्मक प्रतिक्रिया दर (%)',
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
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createDoughnutChart(canvasId, data) {
    // Skip if no data
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
        console.warn(`Skipping chart ${canvasId} - no data`);
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
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function createBarChart(canvasId, data) {
    // Skip if no data
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) {
        console.warn(`Skipping chart ${canvasId} - no data`);
        return;
    }

    createChart(canvasId, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: currentLanguage === 'english' ? 'Responses' : 'प्रतिक्रियाएं',
                data: Object.values(data),
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
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
        alert(currentLanguage === 'english' ? 'Please upload data first!' : 'कृपया पहले डेटा अपलोड करें!');
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
        alert(currentLanguage === 'english' ? 'Please upload data first!' : 'कृपया पहले डेटा अपलोड करें!');
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
