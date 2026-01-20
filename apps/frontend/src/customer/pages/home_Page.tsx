import { Link } from 'react-router-dom';
import { GlassCard, GlassButton } from '@shared/components';

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
          Cook Smart with AI
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Discover delicious recipes based on ingredients you have in stock.
          AI-powered suggestions make cooking easier than ever.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/recipes">
            <GlassButton variant="primary" size="lg">
              🤖 Explore AI Recipes
            </GlassButton>
          </Link>
          <Link to="/products">
            <GlassButton variant="accent" size="lg">
              🛍️ Shop Ingredients
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <GlassCard className="p-6" hover>
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            AI-Powered
          </h3>
          <p className="text-text-secondary">
            Smart recipe suggestions based on available ingredients in our stock
          </p>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Fast Delivery
          </h3>
          <p className="text-text-secondary">
            Quick order processing with real-time stock updates
          </p>
        </GlassCard>

        <GlassCard className="p-6" hover>
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Best Prices
          </h3>
          <p className="text-text-secondary">
            Competitive pricing with automatic cost estimation for recipes
          </p>
        </GlassCard>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Browse Recipes', icon: '📖' },
            { step: '2', title: 'AI Suggests Ingredients', icon: '🤖' },
            { step: '3', title: 'Add to Cart', icon: '🛒' },
            { step: '4', title: 'Cook & Enjoy', icon: '👨‍🍳' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="glass rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                {item.icon}
              </div>
              <div className="text-sm text-accent-teal font-semibold mb-2">
                Step {item.step}
              </div>
              <h4 className="text-lg font-semibold text-text-primary">
                {item.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <GlassCard className="p-12 text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-text-secondary mb-8 text-lg">
            Join thousands of home cooks using AI to discover new recipes
          </p>
          <Link to="/recipes">
            <GlassButton variant="primary" size="lg">
              Get Started Now →
            </GlassButton>
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
