import { dev } from '$app/environment';

export const WEBSITE_URL = dev ? 'http://localhost:5173' : 'https://my-awesome-app.com';
export const TRIAL_DURATION_IN_DAYS = 15;

export const BASIC_STRIPE_PAIEMENT_LINK = 'https://buy.stripe.com/test_8wMdRfa5A4VGggg001';
export const PREMIUM_STRIPE_PAIEMENT_LINK = 'https://buy.stripe.com/test_aEU8wV3Hcdscc00000';
export const STRIPE_CLIENT_PORTAL_LINK =
	'https://billing.stripe.com/p/login/test_bIYeXm6k2gO00QU288';
