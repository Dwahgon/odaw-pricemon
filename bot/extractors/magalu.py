from extractors.extractor import Extractor
from selenium.webdriver.common.by import By


class MagaluExtractor(Extractor):
    def get_price(self, driver, url):
        driver.get(url)
        price_el = driver.find_element(by=By.CSS_SELECTOR, value='div[data-testid="mod-productprice"] p[data-testid="price-value"]')
        return self._parse_price(price_el.get_attribute('innerText'))

