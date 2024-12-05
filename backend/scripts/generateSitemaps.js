const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://luxphonecheck.com'; // URL du site
const OUTPUT_DIR = path.join(__dirname, '../public/sitemaps');

// Créer le dossier sitemaps s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Préfixes mobiles luxembourgeois
const prefixes = ['621', '628', '661', '668', '691', '698'];

// Générer toutes les combinaisons possibles pour un préfixe
function generateNumbersForPrefix(prefix) {
    const numbers = [];
    // Générer les 1000000 combinaisons possibles pour les 6 chiffres restants
    for (let i = 0; i < 1000000; i++) {
        const suffix = i.toString().padStart(6, '0');
        numbers.push(prefix + suffix);
    }
    return numbers;
}

// Générer un sitemap pour un ensemble de numéros
function generateSitemap(numbers, filename) {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    numbers.forEach(number => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${SITE_URL}/numero/${number}</loc>\n`;
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    fs.writeFileSync(path.join(OUTPUT_DIR, filename), sitemap);
    console.log(`Generated ${filename}`);
}

// Générer le sitemap index
function generateSitemapIndex(sitemapFiles) {
    let index = '<?xml version="1.0" encoding="UTF-8"?>\n';
    index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemapFiles.forEach(file => {
        index += '  <sitemap>\n';
        index += `    <loc>${SITE_URL}/sitemaps/${file}</loc>\n`;
        index += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        index += '  </sitemap>\n';
    });

    index += '</sitemapindex>';

    fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-index.xml'), index);
    console.log('Generated sitemap-index.xml');
}

// Générer les sitemaps pour chaque préfixe
const sitemapFiles = [];

prefixes.forEach(prefix => {
    const numbers = generateNumbersForPrefix(prefix);
    
    // Diviser en chunks de 4999 URLs maximum
    const chunkSize = 4999;
    for (let i = 0; i < numbers.length; i += chunkSize) {
        const chunk = numbers.slice(i, i + chunkSize);
        const chunkIndex = Math.floor(i / chunkSize) + 1;
        const filename = `sitemap-${prefix}-${chunkIndex}.xml`;
        generateSitemap(chunk, filename);
        sitemapFiles.push(filename);
    }
});

// Générer le sitemap index
generateSitemapIndex(sitemapFiles);
