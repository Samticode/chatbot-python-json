import csv
import json

# Read the CSV file
with open('./nnlFAQ.csv', 'r') as file:
    reader = csv.DictReader(file)
    data = list(reader)

    # Edit the data
for row in data:
    if 'Likes' in row:
        del row['Likes']
    if 'Forum' in row:
        del row['Forum']
    if 'Product' in row:
        del row['Product']
    if 'Unique ID' in row:
        del row['Unique ID']
    if 'Published On' in row:
        del row['Published On']
    if 'Collection ID' in row:
        del row['Collection ID']
    if 'Slug' in row:
        del row['Slug']
        
    if 'Answer' in row:
        row['bot_response'] = row['Answer']
        del row['Answer']


        
        
# Write the edited data to a JSON file
# with open('./json.json', 'w') as fun:
#     json.dump(data, fun, indent=4)