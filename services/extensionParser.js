const cheerio = require('cheerio');

function parseSearchResults(html, sourceUrl) {
  try {
    const $ = cheerio.load(html);
    const results = [];

    // Parsing genérico - ajustar según el sitio
    // Este es un ejemplo básico
    
    $('.manga-item, .search-result, .book-item').each((i, elem) => {
      const $elem = $(elem);
      
      const title = $elem.find('.title, h3, h4, .name').first().text().trim();
      const url = $elem.find('a').first().attr('href');
      const cover = $elem.find('img').first().attr('src');
      
      if (title && url) {
        results.push({
          title,
          url: url.startsWith('http') ? url : `${sourceUrl}${url}`,
          coverUrl: cover && cover.startsWith('http') ? cover : cover ? `${sourceUrl}${cover}` : null
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Parse error:', error.message);
    return [];
  }
}

function parseChapters(html, sourceUrl) {
  try {
    const $ = cheerio.load(html);
    const chapters = [];

    $('.chapter-item, .chapter, .chapter-list li').each((i, elem) => {
      const $elem = $(elem);
      
      const title = $elem.find('.chapter-title, a').first().text().trim();
      const url = $elem.find('a').first().attr('href');
      
      if (title && url) {
        chapters.push({
          title,
          url: url.startsWith('http') ? url : `${sourceUrl}${url}`,
          number: extractChapterNumber(title)
        });
      }
    });

    return chapters;
  } catch (error) {
    console.error('Parse chapters error:', error.message);
    return [];
  }
}

function extractChapterNumber(title) {
  const match = title.match(/chapter\s+(\d+\.?\d*)/i);
  return match ? match[1] : '0';
}

module.exports = {
  parseSearchResults,
  parseChapters
};