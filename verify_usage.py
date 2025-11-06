import pandas as pd

# Read Excel files
english_file = r'C:\Users\Lenovo\Downloads\Feedback Form-Nurses (Responses).xlsx'
df_eng = pd.read_excel(english_file)

print("=" * 80)
print("COLUMN USAGE VERIFICATION")
print("=" * 80)

# All columns from Excel
all_columns = list(df_eng.columns)

# Columns currently mapped in questionMappings
mapped_columns_english = {
    'Timestamp',
    'Email address',
    'Name and Employee ID',
    'Is the tablet working well for consultations?',
    'Do you face internet problems during consultations?',
    'Do you know how to use the tablet?',
    'If tablet or internet has a problem, do you get help quickly?',
    'Are the doctors nice and respectful during consultations?',
    'Do you face any problems working with the partner staff in the clinic?  ',
    'Are you comfortable with the current clinic timings? ',
    'If not, please tell us what timing changes would help you work better:  ',
    'Are you able to explain doctor\'s advice to patients clearly?',
    'Is your clinic clean and in a good condition?',
    'Do you feel safe working alone in the clinic?',
    'Do you get all the medicines you need at the clinic?',
    'Are your DCs and field managers helpful?',
    'Are you able to complete your monthly target?',
    'Do patients behave well with you?',
    'Do patients trust you at the clinic?',
    'Do you get help during health diagnostic camps?',
    'Are all the essential equipment in the clinic working properly?',
    'Do you require any additional training?',
    'Do you feel proud of your work?',
    'Do you feel you can grow in your career while working at M-Swasth? ',
    'Would you tell a friend to work here? (Rate from 1 to 10)',
    'How far is the clinic from your residence? (in meters/ kilometers)',
    'Any additional help you require to work better?',
    'Things that can make your clinic better',
    'Any feedback for the management'
}

print("\nCOLUMNS IN USE ({} columns):".format(len(mapped_columns_english)))
print("-" * 80)
for i, col in enumerate(all_columns, 1):
    if col in mapped_columns_english:
        print(f"{i}. {col}")

unused = []
for i, col in enumerate(all_columns, 1):
    if col not in mapped_columns_english:
        unused.append((i, col))

if unused:
    print("\n\nCOLUMNS NOT USED ({} columns):".format(len(unused)))
    print("-" * 80)
    for idx, col in unused:
        print(f"{idx}. {col}")
else:
    print("\n\nALL 29 COLUMNS ARE BEING USED!")

print("\n\nSUMMARY:")
print("-" * 80)
print(f"Total columns in Excel: {len(all_columns)}")
print(f"Columns mapped/used: {len(mapped_columns_english)}")
print(f"Columns not used: {len(unused)}")
print(f"Usage percentage: {(len(mapped_columns_english) / len(all_columns) * 100):.1f}%")
