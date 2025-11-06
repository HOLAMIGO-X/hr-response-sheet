import pandas as pd
import json

# Read the Excel files
english_file = r"C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx"
hindi_file = r"C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx"

# Read English data
print("Reading English file...")
df_english = pd.read_excel(english_file)
english_data = df_english.to_dict('records')

# Read Hindi data
print("Reading Hindi file...")
df_hindi = pd.read_excel(hindi_file)
hindi_data = df_hindi.to_dict('records')

# Create embedded data structure
embedded_data = {
    'english': english_data,
    'hindi': hindi_data
}

# Save as JavaScript file
print("Creating JavaScript data file...")
js_content = f"""// Embedded nurse feedback data
// Auto-generated from Excel files

const embeddedData = {json.dumps(embedded_data, ensure_ascii=False, indent=2, default=str)};

// Export for use
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = embeddedData;
}}
"""

with open('embedded-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully created embedded-data.js")
print(f"English responses: {len(english_data)}")
print(f"Hindi responses: {len(hindi_data)}")
print(f"File size: {len(js_content) / 1024:.2f} KB")
