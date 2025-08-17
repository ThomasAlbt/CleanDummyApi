const pool = require('../lib/db');

// Try catch est fait en route plutot que dans un service, si erreur il y a, route prendras
// un principe CRUD se feras dans un fichier service

const createPage = async (url) => {
    const [result] = await pool.query(
        `INSERT INTO page_views (page_url) 
         VALUES (?)`,
        [url]
    );
    return result.insertId; // retourne l'Id d'insertion
}

const readPage = async (url) => {
    const [result] = await pool.query(
        `SELECT * FROM page_views 
         WHERE page_url = ?`,
        [url]
    );
    return result[0]; // retourne la premiere ligne trouvée
}

// pas besoin de return dans les prochains, on ne fait que faire un requete

const updatePage = async (time, url) => {
    await pool.query(
        `UPDATE page_views 
         SET 
         view_time_sec = view_time_sec + ?,
         click_count = click_count + 1,
         last_updated = CURRENT_TIMESTAMP
         WHERE page_url = ?`,
        [time, url]
    );
}

const deletePage = async (url) => {
    await pool.query(
        `DELETE FROM page_views 
         WHERE page_url = ?`,
        [url]
    );
}

const checkPage = async (url) => {
  const [[row]] = await pool.query(
    `SELECT id FROM page_views WHERE page_url = ?`, 
    [url]
  );
  return row?.id || null; // return l'id ou false, [[row]] premets de donner la premiere ligne
};

module.exports = { createPage, readPage, updatePage, deletePage, checkPage };