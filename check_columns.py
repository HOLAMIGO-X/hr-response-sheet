import pandas as pd

# Read English file
df_eng = pd.read_excel(r'C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx')
print(f'English file - Total columns: {len(df_eng.columns)}')
print(f'English file - Total rows: {len(df_eng)}')
print('\n=== All English Columns ===')
for i, col in enumerate(df_eng.columns, 1):
    # Check how many non-empty responses
    non_empty = df_eng[col].notna().sum()
    print(f'{i}. {col}')
    print(f'   Non-empty responses: {non_empty}/{len(df_eng)}')

# Read Hindi file
df_hin = pd.read_excel(r'C:\Users\Lenovo\Downloads\फीडबैक फॉर्म – नर्स (Responses).xlsx')
print(f'\n\nHindi file - Total columns: {len(df_hin.columns)}')
print(f'Hindi file - Total rows: {len(df_hin)}')
print('\n=== All Hindi Columns ===')
for i, col in enumerate(df_hin.columns, 1):
    non_empty = df_hin[col].notna().sum()
    print(f'{i}. {col}')
    print(f'   Non-empty responses: {non_empty}/{len(df_hin)}')
