import pandas as pd

# Read both files
english_file = r'C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx'
hindi_file = r'C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx'

df_eng = pd.read_excel(english_file)
df_hin = pd.read_excel(hindi_file)

print("=" * 80)
print("COLUMN MAPPING ANALYSIS")
print("=" * 80)

print(f"\nEnglish columns: {len(df_eng.columns)}")
print(f"Hindi columns: {len(df_hin.columns)}")

print("\n\nENGLISH COLUMNS:")
print("-" * 80)
for i, col in enumerate(df_eng.columns, 1):
    print(f"{i}. {col}")

print("\n\nHINDI COLUMNS:")
print("-" * 80)
for i, col in enumerate(df_hin.columns, 1):
    print(f"{i}. {repr(col)}")

# The approach: We need to normalize both datasets to have the same column names
# We'll use English column names as the standard
print("\n\nSTRATEGY:")
print("-" * 80)
print("We need to:")
print("1. Create a unified column mapping")
print("2. Rename Hindi columns to match English columns")
print("3. Combine both dataframes")
print("4. Update the dashboard to use combined data")
