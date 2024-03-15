import json
import requests


# Load the json from page0.json
count = 1
url = 'https://bn-reg.uis.georgetown.edu/StudentRegistrationSsb/ssb/searchResults/getCourseDescription'

for i in range(0, 12):

    descriptions = []

    with open(f'./src/coursePages/page{i}.json', 'r') as f:
        data = json.load(f)

    # Define the url to make post requests to


    # Loop through each object in the json data
    for obj in data['data']:
        # Extract the course reference number property

        print(str(count) + "/5825")

        newObj = {}
        newObj['courseReferenceNumber'] = obj['courseReferenceNumber']
        #print status
        print("Fetching description for CRN " + obj['courseReferenceNumber'])
        crn = obj['courseReferenceNumber']
        
        # Define the form-data payload
        payload = {'courseReferenceNumber': crn, 'term': '202430', 'first': 'first'}
        
        # Make the post request and output the returned content
        response = requests.post(url, data=payload)


        text = response.text

        #substring for everything between the second > and thrid <

        start = text.find('>', text.find('>') + 1) + 1
        end = text.find('<', start)
        text = text[start:end]

        print(text)

        #add text with CRN to a JSON object

        newObj['description'] = text

        descriptions.append(newObj)
        
        count += 1


    #convert descriptions to a json object
    with open(f'./src/descriptions/descriptions{i}.json', 'w') as f:
        json.dump(descriptions, f)



    #write the response to a file
    

