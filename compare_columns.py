import pandas as pd

# Read both files
english_file = r"C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx"
hindi_file = r"C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx"

df_english = pd.read_excel(english_file)
df_hindi = pd.read_excel(hindi_file)

print("ENGLISH COLUMNS:")
print("="*80)
for i, col in enumerate(df_english.columns, 1):
    print(f"{i:2d}. {col}")

print("\n\nHINDI COLUMNS:")
print("="*80)
for i, col in enumerate(df_hindi.columns, 1):
    print(f"{i:2d}. {col}")

print("\n\nCOLUMN COUNT:")
print(f"English: {len(df_english.columns)}")
print(f"Hindi: {len(df_hindi.columns)}")
