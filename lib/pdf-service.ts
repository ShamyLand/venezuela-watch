import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Définir le type pour jsPDF avec autoTable
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY: number;
    };
}

// Couleurs du thème "Le Guetteur" (Institutionnel / Militaire)
const COLORS = {
    primary: '#1a3c6e', // Bleu Marine Institutionnel
    accent: '#b80f0a', // Rouge Discret
    text: '#2c3e50', // Gris Foncé
    textLight: '#7f8c8d', // Gris Clair
    background: '#ffffff',
    sectionBg: '#f0f3f5', // Gris très pâle pour les blocs
    line: '#bdc3c7'
};

export async function generateVenezuelaPDF(data: any) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    }) as jsPDFWithAutoTable;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // ==================== HEADER (STYLE "LE GUETTEUR") ====================

    // Bande de couleur en haut (Bleu Marine)
    doc.setFillColor(COLORS.primary);
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Titre "LE GUETTEUR" style
    yPos += 15;
    doc.setFont('times', 'bold'); // Police Serif pour l'aspect officiel
    doc.setFontSize(32);
    doc.setTextColor(COLORS.primary);
    doc.text('VENEZUELA WATCH', pageWidth / 2, yPos, { align: 'center' });

    // Sous-titre
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.textLight);
    doc.text('BULLETIN DE VEILLE STRATÉGIQUE', pageWidth / 2, yPos, { align: 'center' });

    // Date et Numéro
    yPos += 12;
    doc.setLineWidth(0.5);
    doc.setDrawColor(COLORS.primary);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text); // Noir
    const generatedDate = new Date(data.metadata.generatedAt);
    const dateStr = generatedDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    // Gauche: Date, Droite: Classification
    doc.text(`DATE : ${dateStr.toUpperCase()}`, margin, yPos);
    doc.text('DIFFUSION RESTREINTE', pageWidth - margin, yPos, { align: 'right' });

    yPos += 4;
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // ==================== EDITO / SYNTHÈSE ====================
    yPos += 15;

    // Titre de section "ÉDITO"
    drawSectionTitle(doc, 'SYNTHÈSE EXÉCUTIVE', margin, yPos);
    yPos += 12;

    // Contenu Édito (2 colonnes si possible, sinon 1 bloc propre)
    // On utilise un fond gris léger pour l'édito pour le faire ressortir
    doc.setFillColor(COLORS.sectionBg);
    doc.roundedRect(margin, yPos - 5, pageWidth - (margin * 2), 40, 2, 2, 'F');

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text);
    const resume = data.aiSummary.synthese_executive?.resume_general || "Pas de résumé disponible.";
    const resumeLines = doc.splitTextToSize(resume, pageWidth - (margin * 2) - 10);
    doc.text(resumeLines, margin + 5, yPos + 3);

    yPos += 45; // Saut après la boîte édito

    // ==================== FAITS MARQUANTS ====================

    drawSectionTitle(doc, 'FAITS MARQUANTS', margin, yPos);
    yPos += 10;

    const pointsCles = data.aiSummary.synthese_executive?.points_cles || [];

    // On dessine les points clés avec des puces carrées rouges
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    pointsCles.forEach((point: string) => {
        // Puce
        doc.setFillColor(COLORS.accent);
        doc.rect(margin, yPos - 3, 2, 2, 'F');

        // Texte
        const pointLines = doc.splitTextToSize(point, pageWidth - margin - 25); // Largeur ajustée
        doc.text(pointLines, margin + 5, yPos);
        yPos += (pointLines.length * 5) + 3;
    });

    yPos += 5;

    // ==================== TABLEAU INDICATEURS ====================

    // Si on a de la place, sinon nouvelle page
    if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
    }

    drawSectionTitle(doc, 'INDICATEURS DE TENSION', margin, yPos);
    yPos += 10;

    const indicators = data.aiSummary.indicateurs_cles;
    const indicatorData = [
        ['Tension Géopolitique', `${indicators.tension_geopolitique}/10`, getIndicatorLevel(indicators.tension_geopolitique)],
        ['Risque Sanctions', `${indicators.risque_sanctions}/10`, getIndicatorLevel(indicators.risque_sanctions)],
        ['Volatilité Pétrole', `${indicators.volatilite_petrole}/10`, getIndicatorLevel(indicators.volatilite_petrole)]
    ];

    autoTable(doc, {
        startY: yPos,
        head: [['Indicateur', 'Score', 'Niveau']],
        body: indicatorData,
        theme: 'plain',
        headStyles: {
            fillColor: COLORS.primary,
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            textColor: COLORS.text,
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: COLORS.sectionBg
        },
        margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ==================== ANALYSE DÉTAILLÉE ====================

    doc.addPage();
    yPos = margin;

    drawSectionTitle(doc, 'ANALYSE GÉOPOLITIQUE ET PÉTROLIÈRE', margin, yPos);
    yPos += 10;

    // 2 Colonnes simulées par des zones de texte
    const colWidth = (pageWidth - (margin * 3)) / 2;

    // Colonne 1: Géopolitique
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.primary);
    doc.text('CONJONCTURE POLITIQUE', margin, yPos);

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    const geoText = (data.aiSummary.analyse_geopolitique?.contexte || "") + "\n\n" + (data.aiSummary.analyse_geopolitique?.developpements_recents || "");
    const geoLines = doc.splitTextToSize(geoText, colWidth);
    doc.text(geoLines, margin, yPos + 6);

    // Colonne 2: Pétrole / Économie
    doc.setFont('times', 'bold');
    doc.setTextColor(COLORS.primary);
    doc.text('ÉNERGIE & ÉCONOMIE', margin + colWidth + margin, yPos);

    doc.setFont('times', 'normal');
    doc.setTextColor(COLORS.text);
    const ecoText = (data.aiSummary.analyse_economique?.situation_petrole || "") + "\n\n" + (data.aiSummary.analyse_economique?.sanctions_economiques || "");
    const ecoLines = doc.splitTextToSize(ecoText, colWidth);
    doc.text(ecoLines, margin + colWidth + margin, yPos + 6);

    // ==================== FIL D'ACTUALITÉS (SOURCE DE DONNÉES) ====================
    doc.addPage();
    yPos = margin;

    drawSectionTitle(doc, 'FIL D\'ACTUALITÉS ET ALERTES', margin, yPos);
    yPos += 10;

    // Tableau des news récentes
    const newsRows = data.rawData.news ? data.rawData.news.slice(0, 15).map((n: any) => [
        new Date(n.created_at).toLocaleDateString('fr-FR'),
        n.title,
        n.source
    ]) : [];

    if (newsRows.length > 0) {
        autoTable(doc, {
            startY: yPos,
            head: [['Date', 'Titre de l\'information', 'Source']],
            body: newsRows,
            theme: 'grid',
            headStyles: {
                fillColor: COLORS.primary,
                textColor: 255,
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 30 }
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: COLORS.sectionBg
            },
            margin: { left: margin, right: margin }
        });
    } else {
        doc.setFont('times', 'italic');
        doc.text("Aucune actualité récente à afficher.", margin, yPos);
    }

    // Pied de page (sur toutes les pages)
    const pageCount = doc.internal.pages.length - 1; // -1 car jsPDF compte une page vide initiale parfois ou index 1-based
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`MINISTÈRE DES ARMÉES - LE GUETTEUR / VENEZUELA WATCH - PAGE ${i}/${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Sauvegarder
    const fileName = `Le_Guetteur_Venezuela_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return fileName;
}

// Fonction utilitaire pour dessiner un titre de section style "Guetteur"
function drawSectionTitle(doc: jsPDF, title: string, x: number, y: number) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.accent); // Rouge
    doc.text(title.toUpperCase(), x, y);

    // Ligne de soulignement fine
    const textWidth = doc.getTextWidth(title.toUpperCase());
    doc.setDrawColor(COLORS.line);
    doc.setLineWidth(0.5);
    doc.line(x, y + 2, x + textWidth + 10, y + 2);
}

function getIndicatorLevel(value: number): string {
    if (value < 4) return 'FAIBLE';
    if (value < 7) return 'MODÉRÉ';
    return 'ÉLEVÉ';
}
