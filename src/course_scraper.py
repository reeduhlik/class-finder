import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

import urllib.request
import json
import os

service = Service()
options = webdriver.ChromeOptions()
options.headless = False
driver = webdriver.Chrome(service=service, options=options)

USERNAME = os.environ.get("GEORGETOWN_USERNAME")
PASSWORD = os.environ.get("GEORGETOWN_PASSWORD")


first_url = "https://experience.elluciancloud.com/gsaasproduction/"
print("Logging in...")
# use selenium to get the json from the url
driver.get(first_url)

# Wait for redirect to Georgetown login page
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "j_username")))

driver.find_element(By.NAME, "j_username").send_keys(USERNAME)
driver.find_element(By.NAME, "j_password").send_keys(PASSWORD)
driver.find_element(By.NAME, "_eventId_proceed").click()

print("Waiting for Duo...")

try:

    courses = []
    WebDriverWait(driver, 300).until(
        EC.presence_of_element_located((By.ID, "trust-browser-button"))
    )
    driver.find_element(By.ID, "trust-browser-button").click()

    # Delay 5 seconds to allow for redirect
    time.sleep(5)

    driver.get(
        "https://experience.elluciancloud.com/gsaasproduction/discover/page/all-accounts/Ellucian/Banner%20in%20Experience/BannerSearchCard/StudentRegistrationSsb%2Fssb%2Fterm%2FtermSelection%3Fmode%3Dsearch"
    )

    # Wait for enter eky to be pressed
    input("Press Enter after Duo is completed...")

    # run script to find the session storage token
    code = "8pGYJsiGsohnxt7L"
    # Wait for the search page to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "select2-arrow"))
    )

    # navigate to the search page
    driver.find_element(By.CLASS_NAME, "select2-arrow").click()
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "202510")))
    driver.find_element(By.ID, "202510").click()
    driver.find_element(By.ID, "term-go").click()

    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.ID, "search-go")))
    driver.find_element(By.ID, "search-go").click()

    ##now we can get the json data by looping through each page
    for i in range(0, 12):

        if i == 7:
            num_pages = 400
        else:
            num_pages = 500
        print(" Fetching page " + str(i))
        driver.get(
            "https://reg-prod.georgetown.elluciancloud.com:8103/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=202510&startDatepicker=&endDatepicker=&uniqueSessionId="
            + code
            + "&pageOffset="
            + str(i)
            + "&pageMaxSize=500&sortColumn=subjectDescription&sortDirection=asc"
        )
        print("  Page " + str(i) + " fetched.")
        pre = driver.find_element(By.TAG_NAME, "pre").text

        data = json.loads(pre)
        if data["success"] == False:
            print("  Page " + str(i) + " failed.")
        else:
            courses += data["data"]

        # store the json data from the url in a file called data.json
        # currently a weird bug on page 7 where the data is empty - skip over it until Georgetown fixes it
        with open(f"./src/coursedata.json", "w") as f:
            json.dump(courses, f)
except Exception as e:
    print("Duo timed out.")
    print(e)
