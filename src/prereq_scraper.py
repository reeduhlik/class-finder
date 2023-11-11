import json
import requests


# Load the json from page0.json
count = 1
url = 'https://bn-reg.uis.georgetown.edu/StudentRegistrationSsb/ssb/searchResults/getSectionPrerequisites'

for i in range(0, 12):

    descriptions = []

    with open(f'./src/page{i}.json', 'r') as f:
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
        payload = {'courseReferenceNumber': crn, 'term': '202410', 'first': 'first'}
        
        # Make the post request and output the returned content
        response = requests.post(url, data=payload)


        #test if the response contains the string "No prerequisites information available."

        if "No prerequisite information available." in response.text:
            newObj['prerequisites'] = "N/A"
        else:

            #remove everything before <tbody>
            cleanText = response.text[response.text.find("<tbody>") + 7:]
            #remove everything after </tbody>
            cleanText = cleanText[:cleanText.find("</tbody>")]

            #html decode
            cleanText = cleanText.replace("&amp;", "&")
            cleanText = cleanText.replace("&lt;", "<")
            cleanText = cleanText.replace("&gt;", ">")
            cleanText = cleanText.replace("&quot;", "\"")
            cleanText = cleanText.replace("&apos;", "'")


            #remove the html tags
            cleanText = cleanText.replace("<tr>", "")
            cleanText = cleanText.replace("</tr>", "")
            cleanText = cleanText.replace("<td>", "")
            cleanText = cleanText.replace("</td>", "")

            #remove all whitespace

            cleanText = cleanText.replace("\n", "")
            cleanText = cleanText.replace("\t", "")


            #remove all Undergraduate D and Graduate D

            cleanText = cleanText.replace(" Undergraduate D ", "")
            cleanText = cleanText.replace(" Graduate D ", "")
            
            cleanText = cleanText.replace(" Undergraduate D ", "")
            cleanText = cleanText.replace(" Graduate C ", "")

            #if more than one space, replace with one space
            while "  " in cleanText:
                cleanText = cleanText.replace("  ", " ")


            newObj['prerequisites'] = cleanText

        descriptions.append(newObj)


        
        count += 1


    #convert descriptions to a json object
    with open(f'./src/prereqs/prereqs{i}.json', 'w') as f:
        json.dump(descriptions, f)



    #write the response to a file
    

