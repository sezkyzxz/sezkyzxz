import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { name, email, message, website } = body;

    // Honeypot check: bot biasanya mengisi field tersembunyi 'website'
    if (website) {
      return NextResponse.json({ success: true, message: 'Message sent' });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Please write a message with at least 10 characters.' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('messages').insert({
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 255),
      message: message.trim().slice(0, 3000),
      is_read: false,
    });

    if (error) {
      console.error('Supabase contact insert error:', error);
      return NextResponse.json(
        { error: 'Could not send message right now. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: 'Invalid request data.' },
      { status: 400 }
    );
  }
}
