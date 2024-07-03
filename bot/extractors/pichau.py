from extractors.extractor import Extractor
from selenium.webdriver.common.by import By


class PichauExtractor(Extractor):
    def get_price(self, driver, url):
        driver.get(url)

        # Check if the product is available
        driver.find_element(by=By.XPATH, value='//span[text()="Produto Disponível"]')

        avista_el = driver.find_element(by=By.XPATH, value='//span[text()="à vista"]')

        price_el = driver.find_element(by=By.XPATH, value='..')
        return self._parse_price(price_el.get_attribute('innerText'))

