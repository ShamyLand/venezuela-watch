import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, message: "Email invalide" }, { status: 400 });
        }

        // Check if already exists (optional, unique constraint handles it but we want clean msg)
        // Insert using supabase service role (if configured in lib/supabase or just standard client)
        // If lib/supabase uses public key, we must rely on backend logic or better:
        // Ideally we should use createClient with SUPABASE_SERVICE_ROLE_KEY here for admin rights.
        // But for now, we'll try standard client. If RLS blocks it, user needs to enable public insert
        // OR we use the service key from process.env if available, directly creating a new client here.

        const { createClient } = await import('@supabase/supabase-js');
        const adminAuthClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await adminAuthClient
            .from('subscribers')
            .upsert({ email: email, is_active: true }, { onConflict: 'email' });

        if (error) {
            console.error("Subscription error:", error);
            return NextResponse.json({ success: false, message: "Erreur lors de l'inscription" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Inscription confirmée !" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}
