# 🎯 QUY TRÌNH LÀM VIỆC & BEST PRACTICES

> **Target Audience**: Development Team
> **Purpose**: Standardize development workflow và best practices

---

## 📋 MỤC LỤC

1. [Development Workflow](#1-development-workflow)
2. [Code Standards](#2-code-standards)
3. [Git Best Practices](#3-git-best-practices)
4. [Testing Guidelines](#4-testing-guidelines)
5. [Code Review Checklist](#5-code-review-checklist)
6. [Troubleshooting Common Issues](#6-troubleshooting-common-issues)

---

## 1. DEVELOPMENT WORKFLOW

### 1.1 Daily Workflow

```bash
# 1. Start your day - Pull latest changes
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feat/user-authentication

# 3. Make changes và commit theo Conventional Commits
git add .
git commit -m "feat(backend): add JWT authentication middleware"

# 4. Push to remote
git push origin feat/user-authentication

# 5. Create Pull Request on GitHub
# 6. Wait for Code Review
# 7. Merge sau khi approved
```

### 1.2 Feature Development Cycle

```
1. [Planning] → Đọc spec trong ecommerce_shop_specification.md
2. [Design] → Vẽ wireframe/flowchart nếu cần
3. [Implementation] → Code theo Phase trong COMMIT_HISTORY.md
4. [Testing] → Viết unit tests + manual testing
5. [Code Review] → Tạo PR và request review
6. [Deployment] → Merge vào develop → staging → main
```

---

## 2. CODE STANDARDS

### 2.1 Backend Code Style (NestJS)

**File Naming Convention: `abc_Xyz.ts`**
```
snake_case + PascalCase pattern
✅ user_AuthService.ts
✅ product_Controller.ts
✅ order_Management.module.ts
❌ user-auth.service.ts (kebab-case)
❌ UserAuthService.ts (PascalCase only)
❌ user_auth_service.ts (full snake_case)
```

**Quy tắc:**
- Phần đầu: `lowercase_snake_case`
- Phần type: `PascalCase` (Service, Controller, Module, Entity, Dto)
- Ví dụ: `ingredient_Mapping.dto.ts`, `recipe_Suggestion.service.ts`

**Class Naming:**
```typescript
// PascalCase cho classes
✅ export class UserAuthService {}
❌ export class userAuthService {}

// camelCase cho methods
✅ async validateUser(email: string) {}
❌ async ValidateUser(email: string) {}

// UPPER_SNAKE_CASE cho constants
✅ const MAX_LOGIN_ATTEMPTS = 5;
❌ const maxLoginAttempts = 5;
```

**Service Example:**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
```

### 2.2 Frontend Code Style (React + TypeScript)

**File Naming Convention: `abc_Xyz.tsx`**
```
snake_case + PascalCase pattern
✅ product_Card.tsx
✅ ingredient_Drawer.tsx
✅ admin_Layout.tsx
✅ use_Auth.ts (hooks - file name)
❌ product-card.tsx (kebab-case)
❌ ProductCard.tsx (PascalCase only)
❌ product_card.tsx (full snake_case)
```

**Component Naming:**
```typescript
// PascalCase cho components
✅ export const ProductCard: React.FC<Props> = ({ product }) => {}
❌ export const productCard = () => {}

// camelCase cho hooks (function name)
✅ const useAuth = () => {}
✅ const useAIRecipe = () => {}
❌ const UseAuth = () => {}
```

**Component Structure:**
```typescript
import React from 'react';
import { Product } from '@shared/types/product.types';

// 1. Interface definitions
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

// 2. Component definition
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  // 3. Hooks
  const [isLoading, setIsLoading] = React.useState(false);

  // 4. Event handlers
  const handleAddToCart = async () => {
    setIsLoading(true);
    await onAddToCart(product.id);
    setIsLoading(false);
  };

  // 5. Render
  return (
    <div className="glass-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price)}</p>
      <button onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};
```

### 2.3 CSS/Tailwind Standards

**Class Order:**
```jsx
<div
  className="
    // Layout
    flex items-center justify-between
    // Size
    w-full h-16
    // Spacing
    px-4 py-2 mb-4
    // Typography
    text-lg font-semibold
    // Colors
    bg-bgSecondary text-textPrimary
    // Borders
    border border-gray-700 rounded-lg
    // Effects
    shadow-lg backdrop-blur-md
    // States
    hover:bg-bgTertiary
    transition-all duration-300
  "
>
```

---

## 3. GIT BEST PRACTICES

### 3.1 Branch Naming Convention

```bash
feat/feature-name          # New features
fix/bug-description        # Bug fixes
refactor/component-name    # Code refactoring
docs/document-update       # Documentation
test/test-scenario         # Tests
chore/maintenance-task     # Chores

# Examples:
feat/ai-recipe-suggestion
fix/cart-total-calculation
refactor/product-service
docs/api-documentation
test/auth-service-unit-tests
```

### 3.2 Commit Message Format

**Structure:**
```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi colons, etc
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(backend): add JWT authentication middleware

- Implement JwtStrategy with Passport
- Add JWT guards for protected routes
- Update auth module configuration

Closes #123

---

fix(frontend): resolve cart total calculation error

The cart was showing incorrect total when applying discount.
Changed calculation logic to apply discount before tax.

---

docs: update API documentation with new endpoints

Added documentation for:
- POST /api/recipes/:id/suggest-ingredients
- GET /api/admin/analytics/top-recipes
```

### 3.3 Pull Request Template

**Title:** `[FEAT] Add AI Recipe Suggestion Feature`

**Description:**
```markdown
## 📝 Description
Implements AI-powered recipe suggestion based on available ingredients.

## 🎯 Changes Made
- Created `RecipesService` with AI suggestion logic
- Added `suggest-ingredients` endpoint
- Implemented product-ingredient mapping query
- Added unit tests for AI algorithm

## 📋 Checklist
- [x] Code follows project coding standards
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Unit tests written and passing
- [x] Documentation updated
- [x] No console.log() left in code

## 🧪 Testing
- Tested with 10 different recipes
- Verified stock quantity checking
- Confirmed priority-based product selection

## 📸 Screenshots (if applicable)
[Attach screenshots]

## 🔗 Related Issues
Closes #45
```

---

## 4. TESTING GUIDELINES

### 4.1 Backend Unit Tests (Jest)

**Test Structure:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when email does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
```

### 4.2 Frontend Component Tests (React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Gạo ST25',
    price: 145000,
    image_url: '/images/rice.jpg',
  };

  const mockOnAddToCart = jest.fn();

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    expect(screen.getByText('Gạo ST25')).toBeInTheDocument();
    expect(screen.getByText('₫145,000')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockOnAddToCart).toHaveBeenCalledWith(1);
  });

  it('disables button when loading', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});
```

---

## 5. CODE REVIEW CHECKLIST

### 5.1 Reviewer Checklist

**Functionality:**
- [ ] Code implements the intended feature correctly
- [ ] No breaking changes to existing functionality
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

**Code Quality:**
- [ ] Code follows project standards
- [ ] No code duplication
- [ ] Variables and functions have meaningful names
- [ ] Complex logic has comments
- [ ] No console.log() or debug code

**Testing:**
- [ ] Unit tests are present and pass
- [ ] Test coverage is adequate
- [ ] Tests are meaningful and test actual logic

**Security:**
- [ ] No sensitive data in code
- [ ] Input validation is present
- [ ] SQL injection prevention
- [ ] XSS prevention

**Performance:**
- [ ] No N+1 query problems
- [ ] Efficient algorithms used
- [ ] No memory leaks

---

## 6. TROUBLESHOOTING COMMON ISSUES

### 6.1 Backend Issues

**Issue: Database connection failed**
```bash
# Solution 1: Check .env configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root

# Solution 2: Verify MySQL is running
sudo systemctl status mysql

# Solution 3: Test connection
mysql -u root -p root -h localhost
```

**Issue: TypeORM Entity not found**
```typescript
// Solution: Make sure entity is imported in module
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Category]),
  ],
})
```

### 6.2 Frontend Issues

**Issue: Vite proxy not working**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**Issue: CORS error**
```typescript
// Backend: main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

**Issue: Zustand state not persisting**
```typescript
// Make sure persist middleware is configured
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // your state
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

---

## 📚 ADDITIONAL RESOURCES

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated**: 2026-01-20
**Maintained By**: Senior Engineering Team
