const pageService = require('../services/pageStatsService');
const express = require("express");
const router = express.Router();
const { urlValidation, timeValidation } = require('../middleware/validationMiddleware');
const { validationResult } = require('express-validator');

// Mise en place des routes qui vont utiliser le service pour opperer

router.post('/', [urlValidation(), timeValidation()], async (req, res) => {
    try {

        //geres les erreurs de urlValidation, continue si rien
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const existingPage = await pageService.checkPage(url);
        if (existingPage) {
            const { time, url } = req.body;
            await pageService.updatePage(time, url);
            return res.status(200).json({ action: 'updated' });
        }

        const newPageId = await pageService.createPage(url);
        res.status(201).json({ id: newPageId, url})
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/', urlValidation(), async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }

        const results = await pageService.readPage(url);
        if (!results) {
            return res.status(404).json({ error: "Page not found" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete('/delete', urlValidation(), async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { url } = req.body;

        const existingPage = await pageService.checkPage(url);
        if (existingPage) {
            await pageService.deletePage(url);
            return res.status(200).json({ action: 'deleted' });
        }


    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: "Server error" });
    }
})
