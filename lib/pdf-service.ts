import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Définir le type pour jsPDF avec autoTable
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY: number;
    };
}

// Couleurs du thème Venezuela Watch
const COLORS = {
    primary: '#0a0e27',
    accent: '#00d4ff',
    gold: '#ffd700',
    danger: '#ff6b35',
    success: '#00ff88',
    warning: '#ffa500',
    text: '#ffffff',
    textDark: '#333333',
    border: '#00d4ff'
};

export async function generateVenezuelaPDF(data: any) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    }) as jsPDFWithAutoTable;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // ==================== PAGE DE COUVERTURE ====================

    // Fond dégradé (simulé avec rectangles)
    doc.setFillColor(10, 14, 39); // #0a0e27
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Bande décorative en haut
    doc.setFillColor(0, 212, 255); // #00d4ff
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Titre principal
    doc.setTextColor(255, 215, 0); // Gold
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('VENEZUELA WATCH', pageWidth / 2, 50, { align: 'center' });

    // Sous-titre
    doc.setTextColor(0, 212, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('SYNTHÈSE GÉOPOLITIQUE', pageWidth / 2, 65, { align: 'center' });

    // Date et heure de génération
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    const generatedDate = new Date(data.metadata.generatedAt);
    const dateStr = generatedDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const timeStr = generatedDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(`Généré le ${dateStr} à ${timeStr}`, pageWidth / 2, 80, { align: 'center' });

    // Période couverte
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Période d'analyse: ${data.metadata.dateRange}`, pageWidth / 2, 90, { align: 'center' });

    // Box avec évaluation rapide
    const boxY = 110;
    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, boxY, pageWidth - 2 * margin, 50, 3, 3, 'S');

    doc.setFontSize(14);
    doc.setTextColor(255, 215, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('ÉVALUATION RAPIDE', pageWidth / 2, boxY + 10, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');

    const summary = data.aiSummary.synthese_executive;
    doc.text(`Tendance: ${summary.tendance_generale}`, pageWidth / 2, boxY + 20, { align: 'center' });
    doc.text(`Niveau de risque: ${summary.evaluation_risque}`, pageWidth / 2, boxY + 28, { align: 'center' });

    // Indicateurs visuels (jauges simplifiées)
    const gaugeY = boxY + 35;
    const gaugeWidth = 50;
    const indicators = data.aiSummary.indicateurs_cles;

    doc.setFontSize(8);
    doc.text('Tension Géopolitique', margin + 10, gaugeY);
    drawGauge(doc, margin + 10, gaugeY + 2, gaugeWidth, indicators.tension_geopolitique);

    doc.text('Risque Sanctions', pageWidth / 2 - gaugeWidth / 2, gaugeY);
    drawGauge(doc, pageWidth / 2 - gaugeWidth / 2, gaugeY + 2, gaugeWidth, indicators.risque_sanctions);

    doc.text('Volatilité Pétrole', pageWidth - margin - gaugeWidth - 10, gaugeY);
    drawGauge(doc, pageWidth - margin - gaugeWidth - 10, gaugeY + 2, gaugeWidth, indicators.volatilite_petrole);

    // Watermark discret
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('CONFIDENTIEL - À usage interne uniquement', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // ==================== PAGE 2: SYNTHÈSE EXECUTIVE ====================
    doc.addPage();
    yPos = margin;

    // Header de page
    addPageHeader(doc, 'SYNTHÈSE EXECUTIVE', 2);
    yPos = 30;

    // Résumé général
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');

    const resumeLines = doc.splitTextToSize(summary.resume_general, pageWidth - 2 * margin);
    doc.text(resumeLines, margin, yPos);
    yPos += resumeLines.length * 6 + 10;

    // Points clés
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('POINTS CLÉS STRATÉGIQUES', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');

    summary.points_cles.forEach((point: string, index: number) => {
        const bullet = `${index + 1}.`;
        doc.setFont('helvetica', 'bold');
        doc.text(bullet, margin + 2, yPos);
        doc.setFont('helvetica', 'normal');
        const pointLines = doc.splitTextToSize(point, pageWidth - 2 * margin - 10);
        doc.text(pointLines, margin + 8, yPos);
        yPos += pointLines.length * 5 + 3;
    });

    yPos += 10;

    // Tableau des indicateurs
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('INDICATEURS CLÉS', margin, yPos);
    yPos += 8;

    const indicatorData = [
        ['Tension Géopolitique', `${indicators.tension_geopolitique}/10`, getIndicatorLevel(indicators.tension_geopolitique)],
        ['Volatilité Pétrole', `${indicators.volatilite_petrole}/10`, getIndicatorLevel(indicators.volatilite_petrole)],
        ['Risque Sanctions', `${indicators.risque_sanctions}/10`, getIndicatorLevel(indicators.risque_sanctions)],
        ['Stabilité Régionale', `${indicators.stabilite_regionale}/10`, getIndicatorLevel(indicators.stabilite_regionale)],
        ['Pression Internationale', `${indicators.pression_internationale}/10`, getIndicatorLevel(indicators.pression_internationale)]
    ];

    autoTable(doc, {
        startY: yPos,
        head: [['Indicateur', 'Score', 'Niveau']],
        body: indicatorData,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 212, 255],
            textColor: [10, 14, 39],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    });

    // ==================== PAGE 3: ANALYSE GÉOPOLITIQUE ====================
    doc.addPage();
    addPageHeader(doc, 'ANALYSE GÉOPOLITIQUE', 3);
    yPos = 30;

    const geoAnalysis = data.aiSummary.analyse_geopolitique;

    // Contexte
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Contexte Actuel', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const contexteLines = doc.splitTextToSize(geoAnalysis.contexte, pageWidth - 2 * margin);
    doc.text(contexteLines, margin, yPos);
    yPos += contexteLines.length * 5 + 10;

    // Développements récents
    if (yPos > pageHeight - 60) {
        doc.addPage();
        addPageHeader(doc, 'ANALYSE GÉOPOLITIQUE (suite)', 4);
        yPos = 30;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Développements Récents', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const devLines = doc.splitTextToSize(geoAnalysis.developpements_recents, pageWidth - 2 * margin);
    doc.text(devLines, margin, yPos);
    yPos += devLines.length * 5 + 10;

    // Implications
    if (yPos > pageHeight - 60) {
        doc.addPage();
        addPageHeader(doc, 'ANALYSE GÉOPOLITIQUE (suite)', 5);
        yPos = 30;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Implications', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const implLines = doc.splitTextToSize(geoAnalysis.implications, pageWidth - 2 * margin);
    doc.text(implLines, margin, yPos);

    // ==================== PAGE 4: ANALYSE ÉCONOMIQUE ====================
    doc.addPage();
    addPageHeader(doc, 'ANALYSE ÉCONOMIQUE & PÉTROLIÈRE', doc.internal.pages.length - 1);
    yPos = 30;

    const ecoAnalysis = data.aiSummary.analyse_economique;

    // Situation pétrolière
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Secteur Pétrolier Vénézuélien', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const petroleLines = doc.splitTextToSize(ecoAnalysis.situation_petrole, pageWidth - 2 * margin);
    doc.text(petroleLines, margin, yPos);
    yPos += petroleLines.length * 5 + 10;

    // Prix du pétrole actuels
    if (data.rawData.oilPrices.brent) {
        yPos += 5;
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 20, 2, 2, 'F');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text('PRIX ACTUELS DU PÉTROLE', margin + 5, yPos);
        yPos += 7;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);
        doc.text(`Brent: ${data.rawData.oilPrices.brent} USD/baril`, margin + 5, yPos);
        doc.text(`WTI: ${data.rawData.oilPrices.wti} USD/baril`, pageWidth / 2, yPos);
        yPos += 15;
    }

    // Marché mondial
    if (yPos > pageHeight - 60) {
        doc.addPage();
        addPageHeader(doc, 'ANALYSE ÉCONOMIQUE (suite)', doc.internal.pages.length - 1);
        yPos = 30;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Impact sur le Marché Mondial', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const marcheLines = doc.splitTextToSize(ecoAnalysis.marche_mondial, pageWidth - 2 * margin);
    doc.text(marcheLines, margin, yPos);
    yPos += marcheLines.length * 5 + 10;

    // Sanctions
    if (yPos > pageHeight - 60) {
        doc.addPage();
        addPageHeader(doc, 'ANALYSE ÉCONOMIQUE (suite)', doc.internal.pages.length - 1);
        yPos = 30;
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Sanctions Économiques', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const sanctionsLines = doc.splitTextToSize(ecoAnalysis.sanctions_economiques, pageWidth - 2 * margin);
    doc.text(sanctionsLines, margin, yPos);

    // ==================== PAGE 5: TIMELINE ====================
    doc.addPage();
    addPageHeader(doc, 'CHRONOLOGIE DES ÉVÉNEMENTS', doc.internal.pages.length - 1);
    yPos = 30;

    const timeline = data.aiSummary.timeline_evenements || [];
    const timelineData = timeline.slice(0, 15).map((event: any) => {
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        return [
            dateStr,
            event.titre,
            event.categorie,
            event.impact
        ];
    });

    autoTable(doc, {
        startY: yPos,
        head: [['Date', 'Événement', 'Catégorie', 'Impact']],
        body: timelineData,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 212, 255],
            textColor: [10, 14, 39],
            fontStyle: 'bold',
            fontSize: 9
        },
        bodyStyles: {
            fontSize: 8
        },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 80 },
            2: { cellWidth: 35 },
            3: { cellWidth: 25 }
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    });

    // ==================== PAGE 6: ALERTES ====================
    doc.addPage();
    addPageHeader(doc, 'ALERTES ACTIVES', doc.internal.pages.length - 1);
    yPos = 30;

    const alerts = data.aiSummary.alertes_actives || [];

    alerts.forEach((alert: any, index: number) => {
        if (yPos > pageHeight - 50) {
            doc.addPage();
            addPageHeader(doc, 'ALERTES ACTIVES (suite)', doc.internal.pages.length - 1);
            yPos = 30;
        }

        // Box pour chaque alerte
        const boxHeight = 35;
        const levelColor = alert.niveau === 'CRITIQUE' ? [255, 107, 53] :
            alert.niveau === 'MOYEN' ? [255, 165, 0] :
                [0, 255, 136];

        doc.setFillColor(levelColor[0], levelColor[1], levelColor[2], 0.1);
        doc.setDrawColor(levelColor[0], levelColor[1], levelColor[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 2, 2, 'FD');

        // Niveau d'alerte
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
        doc.text(`[${alert.niveau}]`, margin + 3, yPos + 6);

        // Titre
        doc.setTextColor(51, 51, 51);
        doc.text(alert.titre, margin + 3, yPos + 12);

        // Description
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(alert.description, pageWidth - 2 * margin - 6);
        doc.text(descLines, margin + 3, yPos + 18);

        // Recommandation
        if (alert.recommandation) {
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            const recText = `→ ${alert.recommandation}`;
            const recLines = doc.splitTextToSize(recText, pageWidth - 2 * margin - 6);
            doc.text(recLines, margin + 3, yPos + 28);
        }

        yPos += boxHeight + 8;
    });

    // ==================== PAGE 7: PRÉVISIONS ====================
    doc.addPage();
    addPageHeader(doc, 'PRÉVISIONS & SURVEILLANCE', doc.internal.pages.length - 1);
    yPos = 30;

    const previsions = data.aiSummary.previsions_court_terme;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Prévisions à 7 jours', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const prevLines = doc.splitTextToSize(previsions['7_jours'], pageWidth - 2 * margin);
    doc.text(prevLines, margin, yPos);
    yPos += prevLines.length * 5 + 15;

    // Facteurs de surveillance
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Facteurs Clés à Surveiller', margin, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    previsions.facteurs_surveillance.forEach((facteur: string) => {
        doc.text(`• ${facteur}`, margin + 3, yPos);
        yPos += 6;
    });

    yPos += 15;

    // Sources
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text('Sources Principales', margin, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    data.aiSummary.sources_principales.forEach((source: string) => {
        doc.text(`• ${source}`, margin + 3, yPos);
        yPos += 5;
    });

    // Footer final
    yPos = pageHeight - 20;
    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Ce rapport a été généré automatiquement par VENEZUELA WATCH', pageWidth / 2, yPos + 5, { align: 'center' });
    doc.text(`Date de génération: ${new Date(data.metadata.generatedAt).toLocaleString('fr-FR')}`, pageWidth / 2, yPos + 10, { align: 'center' });

    // Sauvegarder le PDF
    const fileName = `Venezuela_Watch_Synthese_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
}

// ==================== FONCTIONS UTILITAIRES ====================

function addPageHeader(doc: jsPDFWithAutoTable, title: string, pageNum: number) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Bande en haut
    doc.setFillColor(0, 212, 255);
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Titre de la section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 212, 255);
    doc.text(title, 15, 15);

    // Numéro de page
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${pageNum}`, pageWidth - 15, 15, { align: 'right' });

    // Ligne de séparation
    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(0.3);
    doc.line(15, 20, pageWidth - 15, 20);
}

function drawGauge(doc: jsPDF, x: number, y: number, width: number, value: number) {
    const height = 4;
    const fillWidth = (value / 10) * width;

    // Fond de la jauge
    doc.setFillColor(200, 200, 200);
    doc.rect(x, y, width, height, 'F');

    // Remplissage selon la valeur
    let color = value < 4 ? [0, 255, 136] : // Vert
        value < 7 ? [255, 165, 0] : // Orange
            [255, 107, 53]; // Rouge

    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x, y, fillWidth, height, 'F');

    // Bordure
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.2);
    doc.rect(x, y, width, height, 'S');

    // Valeur
    doc.setFontSize(7);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'bold');
    doc.text(`${value}/10`, x + width + 2, y + 3);
}

function getIndicatorLevel(value: number): string {
    if (value < 4) return 'FAIBLE';
    if (value < 7) return 'MODÉRÉ';
    return 'ÉLEVÉ';
}
