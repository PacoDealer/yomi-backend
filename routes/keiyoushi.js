const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

// Cache por 1 hora
const cache = new NodeCache({ stdTTL: 3600 });

const KEIYOUSHI_INDEX = 'https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.min.json';

// GET /api/keiyoushi/extensions
// Devuelve lista de todas las extensiones disponibles
router.get('/extensions', async (req, res) => {
  try {
    // Check cache primero
    const cached = cache.get('extensions');
    if (cached) {
      return res.json(cached);
    }

    // Descargar index de Keiyoushi
    const response = await axios.get(KEIYOUSHI_INDEX);
    const extensions = response.data;

    // Transformar al formato de YOMI
    const yomiExtensions = extensions.map(ext => ({
      id: ext.pkg,
      name: ext.name.replace('Tachiyomi: ', ''),
      version: ext.version,
      lang: ext.lang,
      nsfw: ext.nsfw === 1,
      sources: ext.sources.map(source => ({
        id: source.id,
        name: source.name,
        baseUrl: source.baseUrl,
        lang: source.lang
      }))
    }));

    // Cachear resultado
    cache.set('extensions', yomiExtensions);

    res.json(yomiExtensions);
  } catch (error) {
    console.error('Error fetching extensions:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch extensions',
      message: error.message 
    });
  }
});

// GET /api/keiyoushi/extension/:id
// Devuelve info de una extensión específica
router.get('/extension/:id', async (req, res) => {
  try {
    const extensionId = req.params.id;
    
    const cached = cache.get('extensions');
    if (cached) {
      const extension = cached.find(ext => ext.id === extensionId);
      if (extension) {
        return res.json(extension);
      }
    }

    res.status(404).json({ error: 'Extension not found' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch extension',
      message: error.message 
    });
  }
});

module.exports = router;