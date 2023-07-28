
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
import json


options = Options()
options.headless = True
service = Service(executable_path='./chromedriver_mac64/chromedriver.exe')
driver = webdriver.Chrome(options=options, service=service)

firsturl = "https://myaccess.georgetown.edu/"
secondurl="https://myaccess9.georgetown.edu/BannerExtensibility/customPage/page/HOMEPAGE"
url = "https://bn-reg.uis.georgetown.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=202330&startDatepicker=&endDatepicker=&uniqueSessionId=ivy131690476819227&pageOffset=0&pageMaxSize=500&sortColumn=subjectDescription&sortDirection=asc"


print('fetching data...')
#use selenium to get the json from the url
driver.get(secondurl)
driver.find_element(By.NAME, "j_username").send_keys("***REMOVED***")
driver.find_element(By.NAME, "j_password").send_keys("***REMOVED***")
driver.find_element(By.NAME, "_eventId_proceed").click()

try:
    WebDriverWait(driver, 300).until(EC.presence_of_element_located((By.ID, 'trust-browser-button')))
    driver.find_element(By.ID, "trust-browser-button").click()
    driver.get("https://bn-reg.uis.georgetown.edu/StudentRegistrationSsb/ssb/term/termSelection?mode=search")
    #wait for duo page

    #run script to find the session storage token
    code = driver.execute_script("return window.sessionStorage.getItem('xe.unique.session.storage.id')")

    driver.find_element(By.CLASS_NAME, "select2-arrow").click()
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, '202330')))
    driver.find_element(By.ID, "202330").click()
    driver.find_element(By.ID, "term-go").click()

    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, 'search-go')))
    driver.find_element(By.ID, "search-go").click()

    ##now we can get the json data by looping through each page

    for i in range(0, 12):
        print(" Fetching page " + str(i))
        driver.get("https://bn-reg.uis.georgetown.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=202330&startDatepicker=&endDatepicker=&uniqueSessionId=" + code + "&pageOffset=" + str(500*i) + "&pageMaxSize=500&sortColumn=subjectDescription&sortDirection=asc")
        pre = driver.find_element(By.TAG_NAME, "pre").text
        data = json.loads(pre)
    #store the json data from the url in a file called data.json
        with open(f'src/page{i}.json', 'w') as f:
            json.dump(data, f)
except:
    print("Duo timed out.")




