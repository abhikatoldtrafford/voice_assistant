import Stripe from 'stripe';

// Initialize the Stripe client with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
    typescript: true,
});

// Helper function to format price to display format
export const formatAmountForDisplay = (
    amount: number,
    currency: string = 'USD'
): string => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
    });

    return numberFormat.format(amount);
};

// Helper function to format price for Stripe (convert to cents)
export const formatAmountForStripe = (
    amount: number,
    currency: string = 'USD'
): number => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
    });

    const parts = numberFormat.formatToParts(amount);
    let fraction = '';

    for (const part of parts) {
        if (part.type === 'fraction') {
            fraction = part.value;
        }
    }

    return fraction === '' ? amount * 100 : Math.round(amount * 100);
};