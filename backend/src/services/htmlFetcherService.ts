import axios from 'axios';

class HtmlFetcherService {
  private readonly timeout = 30000;
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  async fetchHtml(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400
      });

      if (typeof response.data !== 'string') {
        throw new Error('Response is not HTML content');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error(`Request timeout: URL took longer than ${this.timeout / 1000} seconds to respond`);
        }
        if (error.response) {
          throw new Error(`Failed to fetch URL: HTTP ${error.response.status}`);
        }
        if (error.code === 'ENOTFOUND') {
          throw new Error('Failed to fetch URL: Domain not found');
        }
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
      throw error;
    }
  }
}

export default new HtmlFetcherService();
