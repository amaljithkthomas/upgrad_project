const axios = require('axios');
const config = require('config');

const GEMINI_API_KEY = config.get('your-gemini-Api-Key');
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function getRecommendations(userHistory, productCatalog) {
const prompt = `
You are an AI assistant for an e-commerce app. Based on the user's purchase and browsing history:
${JSON.stringify(userHistory)}
and the available products:
${JSON.stringify(productCatalog.map(p => ({ _id: p._id, name: p.name, category: p.category })))}
Suggest 5 relevant product recommendations.

Return ONLY a raw JSON array of product _id strings, with NO markdown, NO explanation, and NO formatting. Example: ["id1","id2","id3","id4","id5"]
`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      body
    );
    // Log the raw Gemini response for debugging
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini raw response:', text);
    try {
      // Try to parse the response as a JSON array
      const ids = JSON.parse(text);
      return Array.isArray(ids) ? ids : [];
    } catch (parseErr) {
      console.error('Gemini response parse error:', parseErr, 'Raw text:', text);
      // Try to extract IDs using regex as a fallback
      const matches = text.match(/"([a-f\d]{24})"/gi);
      if (matches) {
        return matches.map(s => s.replace(/"/g, ''));
      }
      return [];
    }
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { getRecommendations };