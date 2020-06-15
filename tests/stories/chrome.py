"""
網頁截圖工具 (powered by Selenium and Chrome)

1. Facebook

    ch = ChromeBrowser()
    ch.facebook_shot('https://www.facebook.com/chuck158207/posts/3660883767261064', 'out.png')

2. Twitter

    ch = ChromeBrowser()
    ch.twitter_shot('https://twitter.com/KamiliaHaraQoo/status/1270284366350958593', 'out.png')

3. 一般網頁

    ch = ChromeBrowser()
    ch.open('https://www.ettoday.net/news/20200611/1735350.htm')
    ch.webpage_shot('out.png')
    ch.element_selector_shot(tag='article', 'article.png')

"""
import time
import sys
from pathlib import Path
from PIL import Image
from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import ElementNotVisibleException, NoSuchElementException
from io import BytesIO


class ChromeBrowser(object):
    def __init__(self, headless=True):
        options = ChromeOptions()
        if headless:
            options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920x1080')
        self.driver = Chrome(options=options)
        if not headless:
            self.driver.maximize_window()

    def __del__(self):
        self.driver.close()

    def open(self, url):
        self.driver.get(url)

    def get_document_size(self):
        width_elements = [
            'document.body.scrollWidth',
            'document.body.offsetWidth',
            'document.documentElement.clientWidth',
            'document.documentElement.scrollWidth',
            'document.documentElement.offsetWidth'
        ]
        height_elements = [
            'document.body.scrollHeight',
            'document.body.offsetHeight',
            'document.documentElement.clientHeight',
            'document.documentElement.scrollHeight',
            'document.documentElement.offsetHeight'
        ]
        self.width = self.driver.execute_script('return Math.max({});'.format(', '.join(width_elements)))
        self.height = self.driver.execute_script('return Math.max({});'.format(', '.join(height_elements)))
        return self.width, self.height

    def webpage_shot(self, output_png_name='page.png', mode='WHOLE_PAGE'):
        """
        mode='USER' 表示將browser變成16:9，模擬使用者看到的情形
        mode 設為其他值(通常設'WHOLE_PAGE'比較好懂)，表示抓整個網頁
        """
        self.get_document_size()  # update self.width and self.height

        if mode == 'USER':
            height = self.width / 16.0 * 9.0  # ratio = 16:9
        else:
            height = self.height

        self.driver.set_window_size(self.width + 100, height + 100)
        # self.img 永遠會存完整的頁面
        self.img = Image.open(BytesIO(self.driver.get_screenshot_as_png()))

        if output_png_name:
            self.img.save(output_png_name)

        return self.img

    def element_shot(self, element, output_png_name='element.png'):
        self.webpage_shot(output_png_name=None, mode='WHOLE_PAGE')

        left = element.location['x']
        top = element.location['y']
        right = element.location['x'] + element.size['width']
        bottom = element.location['y'] + element.size['height']
        img = self.img.crop((left, top, right, bottom))
        if output_png_name:
            img.save(output_png_name)
        return img

    def element_selector_shot(self, tag=None, klass=None, id=None, output_png_name='element.png'):
        element = None
        if id:
            try:
                element = self.driver.find_element_by_id(id)
            except NoSuchElementException:
                pass
        if klass and element is None:
            try:
                element = self.driver.find_element_by_class_name(klass)
            except NoSuchElementException:
                pass
        if tag and element is None:
            try:
                element = self.driver.find_element_by_tag_name(tag)
            except NoSuchElementException:
                pass

        if element:
            return self.element_shot(element, output_png_name)

    def twitter_shot(self, url, output_png_name=None):
        self.open(url)
        tweet = None
        for _ in range(20):
            time.sleep(0.1)
            try:
                tweet = self.driver.find_element_by_tag_name('article')
                break
            except Exception:
                pass
        if not tweet:
            return
        return self.element_shot(tweet, output_png_name)

    def facebook_shot(self, url, output_png_name=None):
        self.open(url)
        self.driver.execute_script("return document.getElementById('headerArea').style.visibility = 'hidden';")
        fb = None
        for _ in range(20):
            time.sleep(0.1)
            try:
                fb = self.driver.find_element_by_class_name('userContentWrapper')
                fb = fb.find_element_by_tag_name('div')  # first div tag
                break
            except Exception:
                pass
        if not fb:
            return
        return self.element_shot(fb, output_png_name)

    def amp_pause(self):
        script = 'return document.querySelector(".i-amphtml-system-layer-host").shadowRoot'
        shadow_root = self.driver.execute_script(script)
        pause = shadow_root.find_element_by_class_name('i-amphtml-story-pause-control')
        pause.send_keys(Keys.SPACE)

    def amp_go_next(self):
        c = self.driver.find_element_by_class_name('next-container')
        button = c.find_element_by_class_name('i-amphtml-story-button-move')
        button.send_keys(Keys.SPACE)

    def amp_go_prev(self):
        c = self.driver.find_element_by_class_name('prev-container')
        button = c.find_element_by_class_name('i-amphtml-story-button-move')
        button.send_keys(Keys.SPACE)

    def amp_current_page(self):
        for page in self.driver.find_elements_by_tag_name('amp-story-page'):
            if page.get_attribute('aria-hidden') == 'false':
                break
        return page

    def amp_page_shot(self, wanted_pages=[]):
        self.amp_pause()
        num_pages = len(self.driver.find_elements_by_tag_name('amp-story-page'))
        print(f'Total {num_pages} pages')
        for i in range(num_pages):
            # 如果指定 wanted_pages=[0, 3, 5]，就只會抓這三頁的截圖
            if wanted_pages and i not in wanted_pages:
                self.amp_go_next()
                self.amp_pause()
                continue

            page = self.amp_current_page()
            print('=' *20, f'Page {i}', '=' * 20)
            print(page.text)
            time.sleep(0.5)
            self.element_shot(page, f'page_{i}.png')
            try:  # 最後一頁時，next button 會變成 reload button
                self.amp_go_next()
                self.amp_pause()
            except ElementNotVisibleException:
                break


if __name__ == '__main__':
    path = str(Path(sys.argv[1]).absolute())
    ch = ChromeBrowser()
    ch.open('file://' + path)
    ch.amp_page_shot()
