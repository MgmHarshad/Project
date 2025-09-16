# expand_dataset.py
import pandas as pd
import numpy as np

# Load your original dataset
df = pd.read_csv("spoilage_data.csv")

expanded_rows = []

# step size for generating samples (you can tune: 0.5 = half-hour, 1 = hourly)
STEP = 0.5

for food in df['Food_Type'].unique():
    food_data = df[df['Food_Type'] == food].sort_values('Hours_Since_Prepared')
    thresholds = dict(zip(food_data['Spoilage_Risk'], food_data['Hours_Since_Prepared']))
    
    low_cut = thresholds.get("Low")
    med_cut = thresholds.get("Medium")
    high_cut = thresholds.get("High")

    # Generate Low range (0 -> Medium cutoff)
    if low_cut is not None and med_cut is not None:
        for h in np.arange(low_cut, med_cut, STEP):
            expanded_rows.append([food, round(h,2), "Low"])

    # Generate Medium range (Medium cutoff -> High cutoff)
    if med_cut is not None and high_cut is not None:
        for h in np.arange(med_cut, high_cut, STEP):
            expanded_rows.append([food, round(h,2), "Medium"])

    # Generate High range (High cutoff -> High+3 hours for safety)
    if high_cut is not None:
        for h in np.arange(high_cut, high_cut+3, STEP):
            expanded_rows.append([food, round(h,2), "High"])

# Build expanded DataFrame
expanded_df = pd.DataFrame(expanded_rows, columns=["Food_Type","Hours_Since_Prepared","Spoilage_Risk"])

# Save expanded dataset
expanded_df.to_csv("spoilage_data_expanded.csv", index=False)

print("✅ Expanded dataset saved to spoilage_data_expanded.csv")
print("Original size:", len(df), "Expanded size:", len(expanded_df))
