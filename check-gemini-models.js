// Script pour lister les modèles Gemini disponibles
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY non trouvée dans .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log("🔍 Interrogation de l'API Google Generative AI...\n");

    try {
        // Méthode pour lister les modèles disponibles
        const models = await genAI.listModels();

        console.log("✅ MODÈLES DISPONIBLES POUR VOTRE CLÉ API:\n");
        console.log("=".repeat(60));

        for (const model of models) {
            console.log(`\n📌 Nom: ${model.name}`);
            console.log(`   Display Name: ${model.displayName || 'N/A'}`);
            console.log(`   Description: ${model.description || 'N/A'}`);
            console.log(`   Méthodes supportées: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        }

        console.log("\n" + "=".repeat(60));
        console.log(`\n✅ Total: ${models.length} modèle(s) disponible(s)`);

    } catch (error) {
        console.error("\n❌ ERREUR lors de la récupération des modèles:");
        console.error(error.message);
        if (error.response) {
            console.error("Détails:", error.response.data);
        }
    }
}

listModels();
