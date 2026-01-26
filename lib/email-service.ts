import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Valid dummy key to prevent crash on init if missing

interface AlertEmailProps {
    email: string;
    alerts: any[];
    analysisFlash: any;
}

export async function sendAlertEmail({ email, alerts, analysisFlash }: AlertEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY is missing. Email simulation: To", email);
        return { success: true, simulated: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Venezuela Watch <onboarding@resend.dev>', // User will need to verify domain or use this test sender
            to: [email],
            subject: `🚨 ALERTE VENEZUELA: ${alerts.length} Nouveaux événements`,
            html: `
        <div style="font-family: monospace; background-color: #0a0e17; color: #e8e8e8; padding: 20px;">
          <h1 style="color: #00d4ff;">VENEZUELA WATCH // INTELLIGENCE REPORT</h1>
          
          <div style="border: 1px solid #00d4ff; padding: 15px; margin-bottom: 20px; color: #00d4ff;">
             <strong>FLASH TENDANCE:</strong> ${analysisFlash.tendance} (${analysisFlash.tendance_label})
          </div>

          <h2>⚠️ ALERTES MAJEURES</h2>
          ${alerts.map((a: any) => `
            <div style="border-left: 4px solid #ff3b3b; padding-left: 10px; margin-bottom: 15px;">
              <h3 style="margin: 0; color: #ff3b3b;">${a.title || a.titre}</h3>
              <p style="margin: 5px 0 0 0; font-size: 14px;">${a.description}</p>
              <div style="font-size: 10px; color: #888; margin-top: 5px;">
                SOURCE: ${a.source_citee || 'OSINT General'} | INTEL SCORE: ${analysisFlash.report?.risk || 'N/A'}/10
              </div>
            </div>
          `).join('')}

          <div style="margin-top: 30px; border-top: 1px solid #333; padding-top: 10px; font-size: 10px; text-align: center; color: #666;">
            <p>Cet email est généré automatiquement par l'IA de veille stratégique.</p>
            <p>Barème de fiabilité: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/transparency" style="color: #00ff88;">Consulter la méthodologie</a></p>
          </div>
        </div>
      `,
        });

        if (error) {
            console.error("❌ Email failed:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("❌ Email exception:", error);
        return { success: false, error };
    }
}
