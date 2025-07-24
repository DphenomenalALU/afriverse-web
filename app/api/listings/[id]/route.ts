import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data: listing, error } = await supabase
      .from('listings')
      .select('model_3d, try_on_available')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch listing' },
        { status: 400 }
      );
    }

    if (!listing.try_on_available || !listing.model_3d) {
      return NextResponse.json(
        { error: '3D model not available for this item' },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 