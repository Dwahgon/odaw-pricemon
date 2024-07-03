from extractors.extractor import Extractor
from selenium.webdriver.common.by import By


class MercadoLivreExtractor(Extractor):
    def get_price(self, driver, url):
        driver.get(url)
        return float(driver.find_element(by=By.CSS_SELECTOR, value='.andes-money-amount meta').get_attribute('content'))

