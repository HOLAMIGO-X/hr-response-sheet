import pandas as pd
import json

# Read the Excel files
english_file = r'C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx'
hindi_file = r'C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx'

print("Reading English file...")
df_english = pd.read_excel(english_file)

print("Reading Hindi file...")
df_hindi = pd.read_excel(hindi_file)

# Column mapping: Hindi column name -> English column name
# This maps each Hindi column to its corresponding English column
column_mapping = {
    'Timestamp': 'Timestamp',
    'Email address': 'Email address',
    'नाम  और  Employee ID ': 'Name and Employee ID',
    'क्या टैबलेट डॉक्टर से बात करने के लिए ठीक से काम कर रहा है? ': 'Is the tablet working well for consultations?',
    'क्या आपको डॉक्टर से बात करते समय इंटरनेट संबंधी समस्याओं का सामना करना पड़ता है? ': 'Do you face internet problems during consultations?',
    'क्या आप टैबलेट का उपयोग करना जानते हैं? ': 'Do you know how to use the tablet?',
    'यदि टैबलेट या इंटरनेट में कोई समस्या आती है तो क्या आपको तुरंत सहायता मिल जाती है? ': 'If tablet or internet has a problem, do you get help quickly?',
    'क्या डॉक्टर वीडियो कॉल पर अच्छे और सम्मानजनक हैं? ': 'Are the doctors nice and respectful during consultations?',
    'क्या आपको क्लिनिक में पार्टनर स्टाफ के साथ काम करने में कोई समस्या होती है?': 'Do you face any problems working with the partner staff in the clinic?  ',
    'क्या आप क्लिनिक के समय से संतुष्ट हैं?': 'Are you comfortable with the current clinic timings? ',
    'यदि नहीं, तो कृपया हमें बताएं कि क्लिनिक के समय में क्या बदलाव आपके कार्य को बेहतर बनाने में मदद करेंगे?': 'If not, please tell us what timing changes would help you work better:  ',
    'क्या आप मरीज़ को डॉक्टर की सलाह स्पष्ट रूप से समझा सकते हैं? ': 'Are you able to explain doctor\'s advice to patients clearly?',
    'क्या आपका क्लिनिक साफ-सुथरा और अच्छी स्थिति में है? ': 'Is your clinic clean and in a good condition?',
    'क्या आप क्लिनिक में अकेले काम करते हुए सुरक्षित महसूस करते हैं? ': 'Do you feel safe working alone in the clinic?',
    'क्या आपको क्लिनिक में सभी आवश्यक दवाइयां मिल जाती हैं? ': 'Do you get all the medicines you need at the clinic?',
    'क्या आपका डीसी या फील्ड मैनेजर मददगार है? ': 'Are your DCs and field managers helpful?',
    'क्या आप अपना मासिक लक्ष्य पूरा कर पाते हैं? ': 'Are you able to complete your monthly target?',
    'क्या मरीज़ आपके साथ अच्छा व्यवहार करते हैं? ': 'Do patients behave well with you?',
    'क्या मरीज़ क्लिनिक में आप पर भरोसा करते हैं? ': 'Do patients trust you at the clinic?',
    'क्या आपको हेल्थ डायग्नोस्टिक कैंप्स के दौरान सहायता मिलती है? ': 'Do you get help during health diagnostic camps?',
    'क्या पंखे,और लाइट सही से काम करते हैं?': 'Are all the essential equipment in the clinic working properly?',
    'क्या आपको किसी अतिरिक्त प्रशिक्षण की आवश्यकता है? ': 'Do you require any additional training?',
    'क्या आपको अपने काम पर गर्व महसूस होता है? ': 'Do you feel proud of your work?',
    'क्या आप एम-स्वस्थ में काम करते हुए अपने करियर में आगे बढ़ पा रहे हैं? ': 'Do you feel you can grow in your career while working at M-Swasth? ',
    'क्या आप अपने किसी मित्र को यहां काम करने के लिए कहेंगे? (1 से 10 तक रेटिंग दें) ': 'Would you tell a friend to work here? (Rate from 1 to 10)',
    'आपका घर क्लिनिक से कितनी दूर है? (मीटर/किलोमीटर में)': 'How far is the clinic from your residence? (in meters/ kilometers)',
    'क्या आपको बेहतर काम करने के लिए किसी अतिरिक्त सहायता की आवश्यकता है? ': 'Any additional help you require to work better?',
    'ऐसी चीजें जो आपके क्लिनिक को बेहतर बना सकती हैं: ': 'Things that can make your clinic better',
    'प्रबंधन को कोई प्रतिक्रिया: ': 'Any feedback for the management',
    'क्या आपको टैबलेट का उपयोग करने और क्लिनिक में काम करने का प्रशिक्षण मिला था? ': 'Training received (Hindi only)'  # This might be unique to Hindi
}

# Rename Hindi columns to match English
print("Renaming Hindi columns to English...")
df_hindi_renamed = df_hindi.rename(columns=column_mapping)

# Add a language identifier column
df_english['Language'] = 'English'
df_hindi_renamed['Language'] = 'Hindi'

# Combine both datasets
print("Combining datasets...")
df_combined = pd.concat([df_english, df_hindi_renamed], ignore_index=True, sort=False)

print(f"\nCombined dataset created:")
print(f"  English responses: {len(df_english)}")
print(f"  Hindi responses: {len(df_hindi_renamed)}")
print(f"  Total combined: {len(df_combined)}")

# Convert to JSON for embedding
# Replace NaN/NaT with None (null in JSON)
import numpy as np
df_combined = df_combined.replace({np.nan: None})
combined_data = df_combined.to_dict('records')

# Create JavaScript file with combined data
print("\nCreating JavaScript data file...")
js_content = f"""// Combined nurse feedback data (English + Hindi)
// Auto-generated from Excel files
// Total responses: {len(df_combined)} (English: {len(df_english)}, Hindi: {len(df_hindi_renamed)})

const embeddedData = {json.dumps(combined_data, ensure_ascii=False, indent=2, default=str)};

// Export for use
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = embeddedData;
}}
"""

with open('embedded-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully created embedded-data.js")
print(f"Total responses: {len(combined_data)}")
print(f"File size: {len(js_content) / 1024:.2f} KB")
print(f"\nColumns in combined data: {len(df_combined.columns)}")
