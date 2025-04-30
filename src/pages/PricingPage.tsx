import React from 'react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'per month',
    features: [
      'Access to basic study materials',
      'Limited mock tests',
      'Community support',
    ],
    button: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: 'per month',
    features: [
      'All Free features',
      'Unlimited mock tests',
      'Personalized analytics',
      'Downloadable resources',
    ],
    button: 'Start Pro',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '₹999',
    period: 'per month',
    features: [
      'All Pro features',
      '1-on-1 mentorship',
      'Priority support',
      'Early access to new features',
    ],
    button: 'Go Premium',
    highlight: false,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600">Flexible subscription options for every stage of your IIT-JEE journey.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`rounded-2xl shadow-lg p-8 flex flex-col items-center bg-white border-2 transition-all duration-200 ${
              plan.highlight ? 'border-blue-600 scale-105 z-10' : 'border-gray-100'
            }`}
          >
            <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-blue-700' : 'text-gray-800'}`}>{plan.name}</h2>
            <div className="flex items-end mb-4">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-gray-500 ml-2 mb-1">{plan.period}</span>
            </div>
            <ul className="mb-8 space-y-3 text-gray-700 text-left w-full max-w-xs mx-auto">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded-lg font-semibold transition-all duration-150 ${
                plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage; 