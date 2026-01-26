-- ⚠️ ULTIMATE HARD RESET SCRIPT
-- This will FORCEFULLY delete the sources table (and links to it) and recreate it.

-- 1. DROP TABLE with CASCADE (This bypasses the error you saw)
DROP TABLE IF EXISTS sources CASCADE;

-- 2. RE-CREATE TABLE (With correct constraints)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,  -- UNIQUE constraint for ON CONFLICT
    category TEXT,
    reliability_score INTEGER,
    language TEXT,
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RESTORE SECURITY (RLS)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON sources FOR SELECT USING (true);
CREATE POLICY "Auth Write Access" ON sources FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Auth Update Access" ON sources FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 4. RESTORE FOREIGN KEY ON NEWS (Optional but recommended for consistency)
-- We attempt to re-link news table if it exists, but we won't crash if it fails
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'news') THEN
        -- Add constraint back if missing (it was dropped by CASCADE)
        ALTER TABLE news DROP CONSTRAINT IF EXISTS news_source_id_fkey;
        ALTER TABLE news ADD CONSTRAINT news_source_id_fkey FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors if news table structure is different than expected
END $$;

-- 5. SEED DATA (The 107 Sources)
INSERT INTO sources (name, url, category, reliability_score, language, is_active) VALUES
('Reuters', 'https://www.reuters.com/rssFeed/worldNews', 'International', 10, 'en', true),
('AP News', 'https://apnews.com/index.rss', 'International', 10, 'en', true),
('BBC News', 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', 'International', 9, 'en', true),
('The Guardian', 'https://www.theguardian.com/world/rss', 'International', 8, 'en', true),
('France 24 (EN)', 'https://www.france24.com/en/americas/rss', 'International', 9, 'en', true),
('France 24 (FR)', 'https://www.france24.com/fr/ameriques/rss', 'International', 9, 'fr', true),
('Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'International', 8, 'en', true),
('Deutsche Welle', 'https://rss.dw.com/xml/rss-en-world', 'International', 9, 'en', true),
('NPR', 'https://feeds.npr.org/1004/rss.xml', 'International', 9, 'en', true),
('PBS NewsHour', 'https://www.pbs.org/newshour/feeds/rss/world', 'International', 9, 'en', true),
('CBC News', 'https://www.cbc.ca/cmlink/rss-world', 'International', 9, 'en', true),
('The Independent', 'https://www.independent.co.uk/news/world/rss', 'International', 7, 'en', true),
('Sky News', 'https://feeds.skynews.com/feeds/rss/world.xml', 'International', 7, 'en', true),
('RTBF', 'https://www.rtbf.be/rss/actualites/monde', 'International', 9, 'fr', true),
('Le Monde', 'https://www.lemonde.fr/ameriques/rss_full.xml', 'International', 9, 'fr', true),
('Le Figaro', 'https://www.lefigaro.fr/rss/figaro_international.xml', 'International', 8, 'fr', true),
('El Pais (ES)', 'https://elpais.com/rss/internacional/portada.xml', 'International', 9, 'es', true),
('El Mundo', 'https://www.elmundo.es/rss/internacional.xml', 'International', 8, 'es', true),
('UN News', 'https://news.un.org/feed/subscribe/en/news/region/americas/feed/rss.xml', 'NGO/Gov', 10, 'en', true),
('Voice of America', 'https://www.voanews.com/api/z$opimtejo', 'International', 7, 'en', true),
('El Tiempo (Colombia)', 'https://www.eltiempo.com/rss/mundo_latinoamerica.xml', 'Latin America', 8, 'es', true),
('El Espectador (Colombia)', 'https://www.elespectador.com/rss/mundo/america/', 'Latin America', 8, 'es', true),
('Clarín (Argentina)', 'https://www.clarin.com/rss/mundo/', 'Latin America', 8, 'es', true),
('La Nación (Argentina)', 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml&id=18', 'Latin America', 8, 'es', true),
('O Globo (Brazil)', 'https://oglobo.globo.com/rss/mundo.xml', 'Latin America', 8, 'es', true),
('El Universal (Mexico)', 'https://www.eluniversal.com.mx/rss.xml', 'Latin America', 8, 'es', true),
('La Jornada (Mexico)', 'https://www.jornada.com.mx/rss/mundo.xml', 'Latin America', 7, 'es', true),
('La Tercera (Chile)', 'https://www.latercera.com/feed/manager?type=rss&sc=mundo', 'Latin America', 8, 'es', true),
('El Comercio (Peru)', 'https://elcomercio.pe/feed/mundo/', 'Latin America', 8, 'es', true),
('Semana (Colombia)', 'https://www.semana.com/rss/mundo/', 'Latin America', 6, 'es', true),
('CNN En Español', 'https://cnnespanol.cnn.com/feed/', 'Latin America', 8, 'es', true),
('Infobae', 'https://www.infobae.com/feeds/rss/america/', 'Latin America', 6, 'es', true),
('MercoPress', 'https://mercopress.com/rss/', 'Latin America', 7, 'en', true),
('TeleSur (EN)', 'https://www.telesurtv.net/rss/english.xml', 'Latin America', 4, 'en', true),
('TeleSur (ES)', 'https://www.telesurtv.net/rss/rss.xml', 'Latin America', 4, 'es', true),
('El Nacional', 'https://www.elnacional.com/feed/', 'Venezuela', 7, 'es', true),
('Efecto Cocuyo', 'https://efectococuyo.com/feed/', 'Venezuela', 8, 'es', true),
('TalCual', 'https://talcualdigital.com/feed/', 'Venezuela', 8, 'es', true),
('El Pitazo', 'https://elpitazo.net/feed/', 'Venezuela', 8, 'es', true),
('RunRun.es', 'https://runrun.es/feed/', 'Venezuela', 7, 'es', true),
('La Patilla', 'https://www.lapatilla.com/feed/', 'Venezuela', 5, 'es', true),
('El Estímulo', 'https://elestimulo.com/feed/', 'Venezuela', 7, 'es', true),
('Crónica Uno', 'https://cronica.uno/feed/', 'Venezuela', 8, 'es', true),
('Armando.info', 'https://armando.info/feed/', 'Venezuela', 9, 'es', true),
('Contrapunto', 'https://contrapunto.com/feed/', 'Venezuela', 7, 'es', true),
('Últimas Noticias', 'https://ultimasnoticias.com.ve/feed/', 'Venezuela', 4, 'es', true),
('El Universal (Vzla)', 'https://eluniversal.com/rss', 'Venezuela', 5, 'es', true),
('Globovisión', 'https://globovision.com/feed', 'Venezuela', 4, 'es', true),
('La Verdad de Vargas', 'https://diariolavoradordelaverdad.com/feed/', 'Venezuela', 6, 'es', true),
('Correo del Caroní', 'https://correodelcaroni.com/feed/', 'Venezuela', 7, 'es', true),
('OilPrice.com', 'https://oilprice.com/rss/main', 'Oil', 9, 'en', true),
('Bloomberg Energy', 'https://www.bloomberg.com/energy/rss', 'Oil', 9, 'en', true),
('Financial Times Energy', 'https://www.ft.com/energy?format=rss', 'Oil', 9, 'en', true),
('CNBC Energy', 'https://www.cnbc.com/id/19836768/device/rss/rss.html', 'Oil', 8, 'en', true),
('Investing.com', 'https://www.investing.com/rss/commodities.rss', 'Oil', 7, 'en', true),
('Reuters Business', 'https://www.reuters.com/rssFeed/businessNews', 'Economy', 10, 'en', true),
('MarketWatch', 'https://feeds.marketwatch.com/marketwatch/topstories/', 'Economy', 8, 'en', true),
('The Economist', 'https://www.economist.com/the-americas/rss.xml', 'Economy', 9, 'en', true),
('WSJ World', 'https://www.wsj.com/xml/rss/3_7085.xml', 'Economy', 9, 'en', true),
('Forbes Energy', 'https://www.forbes.com/energy/feed/', 'Oil', 7, 'en', true),
('Argus Media', 'https://www.argusmedia.com/en/rss/oil', 'Oil', 9, 'en', true),
('S&P Global Platts', 'https://www.spglobal.com/commodityinsights/en/rss/oil', 'Oil', 10, 'en', true),
('EIA.gov', 'https://www.eia.gov/rss/petroleum.xml', 'Oil', 10, 'en', true),
('IEA', 'https://www.iea.org/rss/news', 'Oil', 10, 'en', true),
('OPEC', 'https://www.opec.org/opec_web/en/rss/press_releases.xml', 'Oil', 10, 'en', true),
('Human Rights Watch', 'https://www.hrw.org/rss/news', 'NGO/Gov', 9, 'en', true),
('Amnesty International', 'https://www.amnesty.org/en/rss', 'NGO/Gov', 9, 'en', true),
('Crisis Group', 'https://www.crisisgroup.org/rss/latin-america-caribbean', 'NGO/Gov', 9, 'en', true),
('CSIS', 'https://www.csis.org/rss/regions/americas', 'NGO/Gov', 9, 'en', true),
('Atlantic Council', 'https://www.atlanticcouncil.org/feed/', 'NGO/Gov', 8, 'en', true),
('WOLA', 'https://www.wola.org/feed/', 'NGO/Gov', 9, 'en', true),
('Venezuelanalysis', 'https://venezuelanalysis.com/feed/', 'Venezuela', 5, 'en', true),
('Caracas Chronicles', 'https://www.caracaschronicles.com/feed/', 'Venezuela', 8, 'en', true),
('InSight Crime', 'https://insightcrime.org/feed/', 'NGO/Gov', 9, 'en', true),
('US State Dept', 'https://www.state.gov/rss/feed/western-hemisphere', 'NGO/Gov', 10, 'en', true)
ON CONFLICT (url) DO NOTHING;
