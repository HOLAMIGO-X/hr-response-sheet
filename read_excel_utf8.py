import pandas as pd
import json
import sys

# Set UTF-8 encoding for output
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

# Read the English Excel file
english_file = r"C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx"
hindi_file = r"C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx"

try:
    # Read English file
    df_english = pd.read_excel(english_file)
    print("English File Columns:")
    for col in df_english.columns:
        print(f"  - {col}")
    print(f"\nEnglish Data Shape: {df_english.shape}")

    # Read Hindi file
    df_hindi = pd.read_excel(hindi_file)
    print("\n" + "="*80)
    print("Hindi File Columns:")
    for col in df_hindi.columns:
        print(f"  - {col}")
    print(f"\nHindi Data Shape: {df_hindi.shape}")

    # Save sample data as JSON for reference
    sample_data = {
        'english': {
            'columns': df_english.columns.tolist(),
            'sample': df_english.head(3).to_dict('records'),
            'dtypes': {col: str(dtype) for col, dtype in df_english.dtypes.items()}
        },
        'hindi': {
            'columns': df_hindi.columns.tolist(),
            'sample': df_hindi.head(3).to_dict('records'),
            'dtypes': {col: str(dtype) for col, dtype in df_hindi.dtypes.items()}
        }
    }

    with open('sample_data.json', 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2, default=str)

    print("\nSample data saved to sample_data.json")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
