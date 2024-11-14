# Load the page0.json file
# Get the data array
# Only keep the following keys in each dictionary inside the data array:
# 'courseNumber', 'courseTitle', 'subject', 'seatsAvailable'
# Save the cleaned data array to a new file called cleanPage0.json

import json

with open("page0.json") as f:
    data = json.load(f)
    data = data["data"]
    cleaned_data = []
    for d in data:
        d = {
            k: d[k]
            for k in ("courseNumber", "courseTitle", "subject", "seatsAvailable")
        }
        cleaned_data.append(d)
    with open("cleanPage0.json", "w") as f:
        json.dump(cleaned_data, f)
