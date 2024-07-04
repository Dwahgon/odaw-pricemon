import psycopg2
import configparser
import os
import time
from urllib.parse import urlparse
from selenium import webdriver
from extractors.mercadolivre import MercadoLivreExtractor
from extractors.magalu import MagaluExtractor
from datetime import datetime

env = os.environ
db = env['DB_DATABASE']

conn = psycopg2.connect(database=env.get('DB_DATABASE'),
                        host=env.get('DB_HOST'),
                        user=env.get('DB_USER'),
                        password=env.get('DB_PW'),
                        port=env.get('DB_PORT'))
config = configparser.ConfigParser()
config.read('bot.config')

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
driver = webdriver.Chrome(options=options)

EXTRACTORS = {
    'www.mercadolivre.com.br': MercadoLivreExtractor(),
    'www.magazineluiza.com.br': MagaluExtractor(),
}

SLEEP_TIME_S = config['DEFAULT']['SLEEP_TIME_S']

while True:
    print(f'Waiting {SLEEP_TIME_S} seconds')
    time.sleep(int(SLEEP_TIME_S))
    timestamp = datetime.now()
    pricehistory = []

    # Query prices
    with conn.cursor() as cursor:
        cursor.execute("SELECT id, url FROM listings;")
        while (listing := cursor.fetchone()) is not None:
            print(f'Extracting price from: {listing[1]}')
            parsed_url = urlparse(listing[1])
            hostname = parsed_url.hostname
            price = 0
            if hostname in EXTRACTORS:
                try:
                    price = EXTRACTORS[hostname].get_price(driver, listing[1])
                except:
                    pass
            pricehistory.append((listing[0], timestamp.isoformat(), price))

    # Save history
    print("Saving results")
    with conn.cursor() as cursor:
        cursor.executemany("INSERT INTO pricehistory(listing_id, query_timestamp, price) VALUES (%s, %s, %s)", pricehistory)
    conn.commit()
