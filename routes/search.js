const express = require('express');
const router = express.Router();
const { proxyRequest } = require('../services/httpProxy');
const { parseSearchResults } = require('../services/extensionParser');

// POST /api/search
// Body: { sourceUrl: "https://...", query: "one piece", sourceId: "..." }
router.post('/search', async (req, res) => {
  try {
    const { sourceUrl, query, sourceId } = req.body;

    if (!sourceUrl || !query) {
      return res.status(400).json({ 
        error: 'Missing required fields: sourceUrl and query' 
      });
    }

    // Construir URL de búsqueda (depende del sitio)
    const searchUrl = `${sourceUrl}/search?q=${encodeURIComponent(query)}`;

    // Hacer request via proxy
    const html = await proxyRequest(searchUrl);

    // Parsear resultados (genérico)
    const results = parseSearchResults(html, sourceUrl);

    res.json({
      query,
      sourceId,
      results
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
});

// GET /api/manga/:sourceId/:mangaId
// Obtener detalles de un manga
router.get('/manga/:sourceId/:mangaId', async (req, res) => {
  try {
    const { sourceId, mangaId } = req.params;
    
    // Aquí implementarías la lógica específica por source
    // Por ahora devolvemos un placeholder
    
    res.json({
      id: mangaId,
      sourceId,
      title: 'Manga Title',
      chapters: []
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch manga details',
      message: error.message 
    });
  }
});

module.exports = router;