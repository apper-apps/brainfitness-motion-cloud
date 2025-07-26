import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (in production, use your publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

class SubscriptionService {
  constructor() {
    this.subscriptions = [];
    this.plans = [
      {
        id: 'basic-monthly',
        name: 'Basic',
        price: 9.99,
        interval: 'month',
        features: ['5 exercises per day', 'Basic progress tracking', 'Community access']
      },
      {
        id: 'premium-monthly',
        name: 'Premium',
        price: 19.99,
        interval: 'month',
        features: ['Unlimited exercises', 'Advanced analytics', 'AI coaching', 'Priority support']
      },
      {
        id: 'premium-yearly',
        name: 'Premium Annual',
        price: 199.99,
        interval: 'year',
        features: ['Unlimited exercises', 'Advanced analytics', 'AI coaching', 'Priority support', '2 months free']
      }
    ];
  }

  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get available subscription plans
  async getPlans() {
    await this.delay();
    return this.plans.map(plan => ({ ...plan }));
  }

  // Start 7-day free trial
  async startTrial() {
    await this.delay();
    
    const trial = {
      id: 'trial_' + Date.now(),
      status: 'active',
      plan: 'premium-monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      trialDaysRemaining: 7
    };
    
    return { success: true, trial };
  }

  // Create subscription with Stripe
  async createSubscription(planId, paymentMethodId) {
    await this.delay();
    
    try {
      // Mock Stripe subscription creation
      const subscription = {
        id: 'sub_' + Date.now(),
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      };
      
      return { success: true, subscription };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Apply discount code
  async applyDiscount(code, planId) {
    await this.delay();
    
    const discountCodes = {
      'BUNDLE10': {
        type: 'percentage',
        value: 10,
        description: '10% off bundled plans',
        applicable: ['premium-yearly']
      },
      'WELCOME20': {
        type: 'percentage',
        value: 20,
        description: '20% off first month',
        applicable: ['basic-monthly', 'premium-monthly']
      },
      'TRIAL7': {
        type: 'trial_extension',
        value: 7,
        description: 'Extended 7-day trial',
        applicable: ['trial']
      }
    };
    
    const discount = discountCodes[code];
    if (!discount) {
      return { success: false, error: 'Invalid discount code' };
    }
    
    if (!discount.applicable.includes(planId)) {
      return { success: false, error: 'Discount not applicable to this plan' };
    }
    
    const plan = this.plans.find(p => p.id === planId);
    let discountedPrice = plan.price;
    
    if (discount.type === 'percentage') {
      discountedPrice = plan.price * (1 - discount.value / 100);
    }
    
    return {
      success: true,
      discount: {
        ...discount,
        originalPrice: plan.price,
        discountedPrice,
        savings: plan.price - discountedPrice
      }
    };
  }

  // Get current subscription status
  async getSubscriptionStatus() {
    await this.delay();
    
    // Mock current subscription
    return {
      status: 'trial',
      plan: 'premium-monthly',
      trialEndsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      daysRemaining: 6,
      features: this.plans.find(p => p.id === 'premium-monthly').features
    };
  }

  // Cancel subscription
  async cancelSubscription() {
    await this.delay();
    
    return {
      success: true,
      message: 'Subscription will be canceled at the end of the current period',
      cancelAtPeriodEnd: true
    };
  }

  // Resume canceled subscription
  async resumeSubscription() {
    await this.delay();
    
    return {
      success: true,
      message: 'Subscription has been resumed',
      cancelAtPeriodEnd: false
    };
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId) {
    await this.delay();
    
    return {
      success: true,
      message: 'Payment method updated successfully'
    };
  }

  // Get billing history
  async getBillingHistory() {
    await this.delay();
    
    return [
      {
        id: 'inv_001',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        amount: 19.99,
        status: 'paid',
        description: 'Premium Monthly Subscription'
      },
      {
        id: 'inv_002',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        amount: 19.99,
        status: 'paid',
        description: 'Premium Monthly Subscription'
      }
    ];
  }

  // Create Stripe checkout session
  async createCheckoutSession(planId, successUrl, cancelUrl) {
    await this.delay();
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    
    // Mock checkout session creation
    return {
      success: true,
      checkoutUrl: `https://checkout.stripe.com/session_${Date.now()}`
    };
  }
}

export const subscriptionService = new SubscriptionService();