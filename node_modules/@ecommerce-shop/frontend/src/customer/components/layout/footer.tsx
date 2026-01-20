export function Footer() {
  return (
    <footer className="glass mt-20 border-t border-text-muted/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              About Us
            </h3>
            <p className="text-text-secondary text-sm">
              AI-powered recipe suggestions platform helping you cook delicious meals
              with ingredients you have.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-text-secondary hover:text-text-primary text-sm">
                  Products
                </a>
              </li>
              <li>
                <a href="/recipes" className="text-text-secondary hover:text-text-primary text-sm">
                  AI Recipes
                </a>
              </li>
              <li>
                <a href="/orders" className="text-text-secondary hover:text-text-primary text-sm">
                  My Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Contact
            </h3>
            <p className="text-text-secondary text-sm">
              Email: support@ecommerce-shop.com
            </p>
            <p className="text-text-secondary text-sm">
              Phone: 1900-xxxx
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-text-muted/10">
          <p className="text-center text-text-muted text-sm">
            © 2026 Ecommerce Shop. Made with ❤️ by Senior Engineering Team
          </p>
        </div>
      </div>
    </footer>
  );
}
