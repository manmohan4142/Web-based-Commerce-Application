import { NextResponse } from 'next/server';

// Stub: in production, integrate with Mailchimp, ConvertKit, or your email provider.
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    // TODO: persist to DB or send to email service
    return NextResponse.json({ success: true, message: 'Subscribed!' });
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
