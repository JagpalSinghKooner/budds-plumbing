import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const POST = async (request: Request) => {
  const { email } = await request.json();

  // Create contact
  try {
    resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });

    return Response.json({ success: true });
  } catch (_error: unknown) {
    return Response.json(
      { error: 'Error subscribing to updates' },
      { status: 400 }
    );
  }
};
