'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { OrderConfirmation } from '@/components/emails/OrderConfirmation';

export async function sendConfirmationEmail(purchaseId: string) {
  const supabase = createClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Get purchase details
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', purchaseId)
      .single();

    if (purchaseError) throw purchaseError;

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('title, images')
      .eq('id', purchase.listing_id)
      .single();

    if (listingError) throw listingError;

    // Get buyer details
    const { data: buyer, error: buyerError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', purchase.user_id)
      .single();

    if (buyerError) throw buyerError;

    // Send email
    await resend.emails.send({
      from: 'Afriverse <onboarding@resend.dev>',
      to: [buyer.email],
      subject: 'Order Confirmation - Afriverse',
      react: OrderConfirmation({
        purchase,
        listing,
        buyerName: buyer.name || 'Valued Customer',
        buyerEmail: buyer.email,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
} 