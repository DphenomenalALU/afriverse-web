'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { OrderConfirmation } from '@/components/emails/OrderConfirmation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './supabase/types';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

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

export async function createListing(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies });

  try {
    console.log('Starting listing creation...');

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Authentication required');
    }

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const original_price = formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null;
    const brand = formData.get('brand') as string;
    const category = formData.get('category') as string;
    const condition = formData.get('condition') as string;
    const size = formData.get('size') as string;
    const style = formData.get('style') as string;
    const location = formData.get('location') as string;
    const measurements = JSON.parse(formData.get('measurements') as string);
    const tags = JSON.parse(formData.get('tags') as string);
    const images = formData.getAll('images') as string[];

    console.log('Form data extracted:', {
      title,
      category,
      price,
      images: images.length
    });

    // Upload images to Supabase storage
    const imageUrls = [];
    for (const imageDataUrl of images) {
      try {
        // Convert base64 to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const { data: imageData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, blob, {
            contentType: 'image/jpeg'
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(imageData.path);

        imageUrls.push(publicUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to upload images');
      }
    }

    console.log('Images uploaded:', imageUrls);

    // Generate 3D model if it's a bag/accessory
    let model3dUrl = null;
    if (category === 'Bags & Accessories' && imageUrls.length > 0) {
      try {
        console.log('Starting 3D model generation...');
        const output = await replicate.run(
          "camenduru/tripo-sr:e0d3fe8abce3ba86497ea3530d9eae59af7b2231b6c82bedfc32b0732d35ec3a",
          {
            input: {
              image_path: imageUrls[0],
              foreground_ratio: 0.85,
              do_remove_background: false
            }
          }
        );
        
        if (output && typeof output === 'object' && 'glb_url' in output) {
          model3dUrl = output.glb_url as string;
          console.log('3D model generated:', model3dUrl);
        }
      } catch (error) {
        console.error('3D model generation error:', error);
        // Continue without 3D model
      }
    }

    // Create the listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        user_id: user.id,
        title,
        description,
        price,
        original_price,
        images: imageUrls,
        brand,
        category,
        condition,
        size,
        style: style.toLowerCase(),
        location,
        measurements,
        tags,
        try_on_available: !!model3dUrl,
        model_3d: model3dUrl,
        status: 'active',
      })
      .select()
      .single();

    if (listingError) {
      console.error('Database insertion error:', listingError);
      throw listingError;
    }

    console.log('Listing created successfully:', listing);
    return { success: true, data: listing };

  } catch (error) {
    console.error('Error in createListing:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create listing' };
  }
} 

export async function generate3DModel(imageUrl: string, userId: string) {
  try {
    console.log('Starting 3D model generation with Replicate...');
    
    // Create Supabase client
    const supabase = createClient();
    
    // Generate 3D model with Replicate
    const result = await replicate.run(
      "camenduru/tripo-sr:e0d3fe8abce3ba86497ea3530d9eae59af7b2231b6c82bedfc32b0732d35ec3a",
      {
        input: {
          image_path: imageUrl,
          foreground_ratio: 0.85,
          do_remove_background: false
        }
      }
    );

    console.log('Replicate response:', result);

    // Check if result is an object with an output property
    if (result && typeof result === 'object' && 'output' in result && typeof result.output === 'string') {
      const glbUrl = result.output;
      console.log('Downloading GLB from:', glbUrl);
      
      // Download the .glb file from Replicate
      const response = await fetch(glbUrl);
      if (!response.ok) throw new Error('Failed to download 3D model');
      const modelBlob = await response.blob();

      // Upload to Supabase storage
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.glb`;
      console.log('Uploading to Supabase storage:', fileName);
      
      const { data: modelData, error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(fileName, modelBlob, {
          contentType: 'model/gltf-binary'
        });

      if (uploadError) {
        console.error('Failed to upload 3D model:', uploadError);
        return { success: false, error: 'Failed to upload 3D model' };
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('3d-models')
        .getPublicUrl(modelData.path);

      console.log('3D model uploaded successfully:', publicUrl);
      return { success: true, url: publicUrl };
    }

    console.error('Invalid output from Replicate:', result);
    return { success: false, error: 'Invalid response from Replicate' };
  } catch (error) {
    console.error('3D model generation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate 3D model' };
  }
} 