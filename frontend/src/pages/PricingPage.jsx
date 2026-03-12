import React, { useState } from 'react';
import { Check } from 'lucide-react';
import './PricingPage.css';

export default function PricingPage() {
  const [selectedType, setSelectedType] = useState('personal');

  const plans = {
    personal: [
      {
        name: 'Free',
        price: 0,
        period: '/month',
        description: 'Perfect for casual readers',
        features: [
          'Unlimited manga browsing',
          'Basic search functionality',
          'Ad-supported reading',
          'Limited to 5 bookmarks',
          'Standard quality images'
        ],
        cta: 'Get Started',
        recommended: false
      },
      {
        name: 'Premium',
        price: 4.99,
        period: '/month',
        description: 'For dedicated manga fans',
        features: [
          'Everything in Free',
          'Ad-free reading',
          'Unlimited bookmarks',
          'High-quality images',
          'Offline downloads (10/month)',
          'Early access to new chapters'
        ],
        cta: 'Upgrade to Premium',
        recommended: true
      },
      {
        name: 'Pro',
        price: 9.99,
        period: '/month',
        description: 'Ultimate manga experience',
        features: [
          'Everything in Premium',
          'Ultra HD quality',
          'Unlimited offline downloads',
          'Custom reading themes',
          'Community features (comments)',
          'Priority support',
          'Ad-free everywhere'
        ],
        cta: 'Go Pro',
        recommended: false
      }
    ],
    business: [
      {
        name: 'Starter',
        price: 29.99,
        period: '/month',
        description: 'For small content creators',
        features: [
          'Upload up to 10 series',
          'Analytics dashboard',
          'Revenue sharing (30%)',
          'Basic marketing tools',
          'Community moderation'
        ],
        cta: 'Start Selling',
        recommended: false
      },
      {
        name: 'Creator',
        price: 79.99,
        period: '/month',
        description: 'For growing creators',
        features: [
          'Unlimited series uploads',
          'Advanced analytics',
          'Revenue sharing (50%)',
          'Promotional tools',
          'Dedicated creator support',
          'Custom branding'
        ],
        cta: 'Become Creator',
        recommended: true
      },
      {
        name: 'Studio',
        price: 199.99,
        period: '/month',
        description: 'For publishing studios',
        features: [
          'Everything in Creator',
          'Team management (up to 50)',
          'API access',
          'Revenue sharing (60%)',
          'Priority distribution',
          '24/7 dedicated support',
          'Custom integrations'
        ],
        cta: 'Contact Sales',
        recommended: false
      }
    ]
  };

  const currentPlans = plans[selectedType];

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p>Start reading unlimited manga today</p>
        
        <div className="pricing-toggle">
          <button
            className={`toggle-btn ${selectedType === 'personal' ? 'active' : ''}`}
            onClick={() => setSelectedType('personal')}
          >
            Personal
          </button>
          <button
            className={`toggle-btn ${selectedType === 'business' ? 'active' : ''}`}
            onClick={() => setSelectedType('business')}
          >
            Creator
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {currentPlans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}
          >
            {plan.recommended && (
              <div className="recommended-badge">POPULAR</div>
            )}
            
            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>

            <button className={`plan-cta ${plan.recommended ? 'primary' : 'secondary'}`}>
              {plan.cta}
            </button>

            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="feature-icon">
                    <Check size={16} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Can I change my plan anytime?</h4>
            <p>Yes, upgrade or downgrade your plan anytime. Changes take effect at the next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h4>How do I cancel?</h4>
            <p>You can cancel anytime from your account settings. No hidden fees or lock-in contracts.</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer refunds?</h4>
            <p>We offer a 7-day money-back guarantee if you're not satisfied with your subscription.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards, PayPal, Google Pay, and Apple Pay.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
