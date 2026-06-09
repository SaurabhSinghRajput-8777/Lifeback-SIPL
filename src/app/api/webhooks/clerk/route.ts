import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { OnboardingService } from '@/modules/auth/services/onboarding.service';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local', {
      status: 500
    });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the user.created event
  if (evt.type === 'user.created') {
    const { id, email_addresses, unsafe_metadata } = evt.data;

    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      console.error('Missing id or email in webhook payload');
      return new Response('Invalid payload data', { status: 400 });
    }

    try {
      await OnboardingService.persistRole({
        clerkId: id,
        email: email,
        unsafeRoleFromClerk: unsafe_metadata?.role as string | undefined,
      });
      return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
      console.error('Error persisting user role:', error);
      return new Response('Error creating user in database', { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
