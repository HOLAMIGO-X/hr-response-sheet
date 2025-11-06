import pandas as pd
import json

# Read the English Excel file
english_file = r"C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx"
hindi_file = r"C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx"

try:
    # Read English file
    df_english = pd.read_excel(english_file)
    print("English File Columns:")
    print(df_english.columns.tolist())
    print("\nEnglish Data Shape:", df_english.shape)
    print("\nFirst few rows of English data:")
    print(df_english.head())
    print("\n" + "="*80 + "\n")

    # Read Hindi file
    df_hindi = pd.read_excel(hindi_file)
    print("Hindi File Columns:")
    print(df_hindi.columns.tolist())
    print("\nHindi Data Shape:", df_hindi.shape)
    print("\nFirst few rows of Hindi data:")
    print(df_hindi.head())

    # Save sample data as JSON for reference
    sample_data = {
        'english': {
            'columns': df_english.columns.tolist(),
            'sample': df_english.head(3).to_dict('records')
        },
        'hindi': {
            'columns': df_hindi.columns.tolist(),
            'sample': df_hindi.head(3).to_dict('records')
        }
    }

    with open('sample_data.json', 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2)

    print("\nSample data saved to sample_data.json")

except Exception as e:
    print(f"Error: {e}")
