const express = require('express');
const router = express.Router();
const dns = require('dns');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const scanCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; 


const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

router.post('/scan', async (req, res) => {
    try {
        const { senderEmail } = req.body;

        
        if (!senderEmail || typeof senderEmail !== 'string' || !isValidEmail(senderEmail)) {
            return res.status(400).json({ error: 'A valid senderEmail is required.' });
        }

        const emailKey = senderEmail.toLowerCase().trim();

        
        const cached = scanCache.get(emailKey);
        if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL_MS) {
            console.log(`[VaultID] Cache hit for: ${emailKey}`);
            return res.status(200).json(cached.result);
        }

        console.log(`[VaultID] Scanning incoming target: ${emailKey}`);
        
        
        const domain = emailKey.split('@')[1];
        try {
            await Promise.any([
                dns.promises.resolveMx(domain),
                dns.promises.resolve4(domain),
                dns.promises.resolveTxt(domain)
            ]);
        } catch (dnsError) {
            console.log(`[VaultID] DNS Lookup failed for ${domain}:`, dnsError.message);
            const failResult = {
                trustScore: 0,
                analysis: `Domain '${domain}' does not exist or has no active DNS records. This is a fake address.`
            };
            scanCache.set(emailKey, { result: failResult, cachedAt: Date.now() });
            return res.status(200).json(failResult);
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
            }
        });

        const prompt = `
        You are VaultID, an elite cybersecurity AI. Analyze this sender email address: "${emailKey}".
        
        Evaluate the following risk factors:
        1. Is it a free provider (e.g., gmail, yahoo) or a corporate domain?
        2. Does it look like typosquatting (e.g., rnicrosoft.com instead of microsoft.com)?
        3. Are there suspicious strings of numbers or random characters?
        4. Is it a legitimate marketing/event alias? (e.g., info@marketing.com, noreply@dare2compete.news, @unstop.com). Do not aggressively penalize legitimate business domains using .news or .info TLDs.
        
        Based on your analysis, calculate a highly granular Trust Score from 1 to 99 (do NOT just default to exactly 100 or 0). 
        - Deduct a few minor points (e.g., -5 or -12) if it is a generic "noreply" or automated alias.
        - Deduct points if the name looks slightly spammy, even if the domain is safe.
        - 0-40 is a confirmed phishing attempt.
        - 90-99 is highly trusted.
        
        Return the result using this exact JSON schema:
        {
          "trustScore": integer,
          "analysis": "string (short 10-15 word explanation of the exact risk or safety factor)"
        }
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        const parsedData = JSON.parse(aiResponse);

        
        scanCache.set(emailKey, { result: parsedData, cachedAt: Date.now() });

        console.log('[VaultID] AI Analysis Complete:', parsedData);
        res.status(200).json(parsedData);

    } catch (error) {
        console.error('[VaultID] Critical AI Error:', error);
        res.status(500).json({
            trustScore: 0,
            analysis: 'VaultID AI offline. Proceed with extreme caution.'
        });
    }
});

module.exports = router;