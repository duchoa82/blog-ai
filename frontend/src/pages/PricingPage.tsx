import React, { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: [
      '5 blog posts per month',
      'Basic AI content generation',
      'Standard templates',
      'Email support'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'secondary'
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    currency: 'USD',
    features: [
      '25 blog posts per month',
      'Advanced AI content generation',
      'Premium templates',
      'SEO optimization',
      'Priority support'
    ],
    popular: true,
    buttonText: 'Start Free Trial',
    buttonVariant: 'primary'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    currency: 'USD',
    features: [
      '100 blog posts per month',
      'Premium AI content generation',
      'Custom templates',
      'Advanced SEO tools',
      'Analytics dashboard',
      '24/7 support'
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    features: [
      'Unlimited blog posts',
      'Custom AI models',
      'White-label solution',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom integrations'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'secondary'
  }
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (plan: PricingPlan) => {
    console.log('Subscribing to plan:', plan.name);
    // TODO: Implement subscription logic
    alert(`Subscribing to ${plan.name} plan!`);
  };

  const getDiscountedPrice = (price: number) => {
    return billingCycle === 'yearly' ? Math.round(price * 0.8) : price;
  };

  return (
    <div>
      <div className="page-header">
        <ui-title-bar title="Pricing Plans">
        </ui-title-bar>
        <div className="header-actions">
          <ui-button variant="primary">Contact Sales</ui-button>
        </div>
      </div>
      
      <style>{`
        .page-header {
          margin-bottom: 24px;
        }

        .header-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
      `}</style>
      
      <ui-layout>
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h1">Choose Your Plan</ui-text>
            <p>Select the perfect plan for your blog content needs</p>
            
            {/* Billing Cycle Toggle */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem',
              margin: '2rem 0'
            }}>
              <span>Monthly</span>
              <ui-toggle
                checked={billingCycle === 'yearly'}
                onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              />
              <span>Yearly <span style={{ color: '#008060' }}>(Save 20%)</span></span>
            </div>
          </ui-card>
        </ui-layout-section>
        
        {/* Pricing Cards */}
        <ui-layout-section>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {pricingPlans.map((plan) => (
              <ui-card key={plan.id} style={{ 
                position: 'relative',
                border: plan.popular ? '2px solid #008060' : '1px solid #e1e3e5',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#008060',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    Most Popular
                  </div>
                )}
                
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <ui-text variant="heading" as="h2">{plan.name}</ui-text>
                  
                  <div style={{ margin: '1rem 0' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                      ${getDiscountedPrice(plan.price)}
                    </span>
                    <span style={{ color: '#6d7175' }}>
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  {billingCycle === 'yearly' && plan.price > 0 && (
                    <div style={{ color: '#008060', fontSize: '14px', marginBottom: '1rem' }}>
                      Save ${Math.round(plan.price * 0.2 * 12)} per year
                    </div>
                  )}
                  
                  <ui-button
                    variant={plan.buttonVariant}
                    full-width
                    onClick={() => handleSubscribe(plan)}
                  >
                    {plan.buttonText}
                  </ui-button>
                </div>
                
                <div style={{ padding: '1rem' }}>
                  <ui-text variant="heading" as="h3" style={{ marginBottom: '1rem' }}>
                    What's included:
                  </ui-text>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{ 
                        padding: '0.5rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ color: '#008060' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ui-card>
            ))}
          </div>
        </ui-layout-section>
        
        {/* FAQ Section */}
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h2">Frequently Asked Questions</ui-text>
            
            <ui-accordion>
              <ui-accordion-item title="Can I change my plan anytime?">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </ui-accordion-item>
              
              <ui-accordion-item title="Is there a free trial?">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </ui-accordion-item>
              
              <ui-accordion-item title="What payment methods do you accept?">
                We accept all major credit cards, PayPal, and Shopify payments.
              </ui-accordion-item>
              
              <ui-accordion-item title="Can I cancel my subscription?">
                Absolutely! You can cancel your subscription at any time with no cancellation fees.
              </ui-accordion-item>
            </ui-accordion>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
    </div>
  );
}
