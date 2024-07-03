import re

class Extractor:
    def _parse_price(self, text: str, brazilian_format = True):
        price_re = r'(\d{1,3}.)*\d{1,3}\,\d{1,2}' if brazilian_format else r'(\d{1,3},)*\d{1,3}\.\d{1,2}'

        price_re_match = re.search(price_re, text)
        if price_re_match is None:
            raise Exception("Price RegExp didn't match")

        return float(price_re_match.group(0).replace('.', '').replace(',', '.')) if brazilian_format else float(price_re_match.group(0).replace(',', ''))

    def get_price(self, driver, url):
        pass