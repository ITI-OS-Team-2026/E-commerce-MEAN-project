# E-commerce-MEAN-project basic folder structuree
```
E-commerce-MEAN-project
├─ .eslintrc.json
├─ .prettierrc
├─ README.md
├─ client
│  ├─ .editorconfig
│  ├─ .postcssrc.json
│  ├─ .prettierrc
│  ├─ README.md
│  ├─ angular.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ src
│  │  ├─ app
│  │  │  ├─ app.config.ts
│  │  │  ├─ app.css
│  │  │  ├─ app.html
│  │  │  ├─ app.spec.ts
│  │  │  ├─ app.ts
│  │  │  ├─ core
│  │  │  │  ├─ guards
│  │  │  │  ├─ interceptors
│  │  │  │  └─ services
│  │  │  ├─ features
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ components
│  │  │  │  │  ├─ models
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  ├─ category-management
│  │  │  │  │  │  │  ├─ category-management.css
│  │  │  │  │  │  │  ├─ category-management.html
│  │  │  │  │  │  │  ├─ category-management.spec.ts
│  │  │  │  │  │  │  └─ category-management.ts
│  │  │  │  │  │  ├─ content-management
│  │  │  │  │  │  │  ├─ content-management.css
│  │  │  │  │  │  │  ├─ content-management.html
│  │  │  │  │  │  │  ├─ content-management.spec.ts
│  │  │  │  │  │  │  └─ content-management.ts
│  │  │  │  │  │  ├─ order-monitor
│  │  │  │  │  │  │  ├─ order-monitor.css
│  │  │  │  │  │  │  ├─ order-monitor.html
│  │  │  │  │  │  │  ├─ order-monitor.spec.ts
│  │  │  │  │  │  │  └─ order-monitor.ts
│  │  │  │  │  │  └─ users-management
│  │  │  │  │  │     ├─ users-management.css
│  │  │  │  │  │     ├─ users-management.html
│  │  │  │  │  │     ├─ users-management.spec.ts
│  │  │  │  │  │     └─ users-management.ts
│  │  │  │  │  └─ services
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ components
│  │  │  │  │  ├─ models
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  ├─ profile
│  │  │  │  │  │  │  ├─ profile.css
│  │  │  │  │  │  │  ├─ profile.html
│  │  │  │  │  │  │  ├─ profile.spec.ts
│  │  │  │  │  │  │  └─ profile.ts
│  │  │  │  │  │  ├─ signup
│  │  │  │  │  │  │  ├─ signup.css
│  │  │  │  │  │  │  ├─ signup.html
│  │  │  │  │  │  │  ├─ signup.spec.ts
│  │  │  │  │  │  │  └─ signup.ts
│  │  │  │  │  │  ├─ singin
│  │  │  │  │  │  │  ├─ singin.css
│  │  │  │  │  │  │  ├─ singin.html
│  │  │  │  │  │  │  ├─ singin.spec.ts
│  │  │  │  │  │  │  └─ singin.ts
│  │  │  │  │  │  └─ wishlist
│  │  │  │  │  │     ├─ wishlist.css
│  │  │  │  │  │     ├─ wishlist.html
│  │  │  │  │  │     ├─ wishlist.spec.ts
│  │  │  │  │  │     └─ wishlist.ts
│  │  │  │  │  └─ services
│  │  │  │  ├─ cart
│  │  │  │  │  ├─ components
│  │  │  │  │  ├─ models
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  └─ cart
│  │  │  │  │  │     ├─ cart.css
│  │  │  │  │  │     ├─ cart.html
│  │  │  │  │  │     ├─ cart.spec.ts
│  │  │  │  │  │     └─ cart.ts
│  │  │  │  │  └─ services
│  │  │  │  ├─ home
│  │  │  │  │  ├─ components
│  │  │  │  │  ├─ models
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  └─ home-page
│  │  │  │  │  │     ├─ home-page.css
│  │  │  │  │  │     ├─ home-page.html
│  │  │  │  │  │     ├─ home-page.spec.ts
│  │  │  │  │  │     └─ home-page.ts
│  │  │  │  │  └─ services
│  │  │  │  ├─ orders
│  │  │  │  │  ├─ components
│  │  │  │  │  ├─ models
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  ├─ order-history
│  │  │  │  │  │  │  ├─ order-history.css
│  │  │  │  │  │  │  ├─ order-history.html
│  │  │  │  │  │  │  ├─ order-history.spec.ts
│  │  │  │  │  │  │  └─ order-history.ts
│  │  │  │  │  │  └─ order-track
│  │  │  │  │  │     ├─ order-track.css
│  │  │  │  │  │     ├─ order-track.html
│  │  │  │  │  │     ├─ order-track.spec.ts
│  │  │  │  │  │     └─ order-track.ts
│  │  │  │  │  └─ services
│  │  │  │  ├─ products
│  │  │  │  │  ├─ components
│  │  │  │  │  ├─ models
│  │  │  │  │  ├─ pages
│  │  │  │  │  │  ├─ product-details
│  │  │  │  │  │  │  ├─ product-details.css
│  │  │  │  │  │  │  ├─ product-details.html
│  │  │  │  │  │  │  ├─ product-details.spec.ts
│  │  │  │  │  │  │  └─ product-details.ts
│  │  │  │  │  │  └─ products
│  │  │  │  │  │     ├─ products.css
│  │  │  │  │  │     ├─ products.html
│  │  │  │  │  │     ├─ products.spec.ts
│  │  │  │  │  │     └─ products.ts
│  │  │  │  │  └─ services
│  │  │  │  └─ seller
│  │  │  │     ├─ components
│  │  │  │     ├─ models
│  │  │  │     ├─ pages
│  │  │  │     │  ├─ inventory
│  │  │  │     │  │  ├─ inventory.css
│  │  │  │     │  │  ├─ inventory.html
│  │  │  │     │  │  ├─ inventory.spec.ts
│  │  │  │     │  │  └─ inventory.ts
│  │  │  │     │  └─ onboarding
│  │  │  │     │     ├─ onboarding.css
│  │  │  │     │     ├─ onboarding.html
│  │  │  │     │     ├─ onboarding.spec.ts
│  │  │  │     │     └─ onboarding.ts
│  │  │  │     └─ services
│  │  │  └─ shared
│  │  │     ├─ components
│  │  │     ├─ directives
│  │  │     ├─ models
│  │  │     └─ pipes
│  │  ├─ index.html
│  │  ├─ main.ts
│  │  └─ styles.css
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  └─ tsconfig.spec.json
└─ server
   ├─ app.js
   ├─ controllers
   │  └─ new
   ├─ index.js
   ├─ middlewares
   │  ├─ authenticate.js
   │  ├─ errorHandler.js
   │  ├─ rateLimiter.js
   │  ├─ restrictTo.js
   │  ├─ upload.js
   │  └─ validate.js
   ├─ models
   │  └─ new
   ├─ package-lock.json
   ├─ package.json
   ├─ schemas
   │  └─ Purpose
   ├─ services
   │  └─ new
   └─ utils
      ├─ APIError.js
      └─ throwNotFound.js

```


## User Stories & Project Scope

This project is built around the following user stories to ensure all core features are delivered within the 2-week sprint.

### 1. User Authentication & Profile
**US1: User Registration**
As a **Visitor**, I want to **create an account**, so that **I can save my information and track my orders.**
* **Acceptance Criteria:**
    * Validates unique email format.
    * Encrypts passwords before database storage.
    * Redirects to Home page after successful registration.

**US2: Secure Login**
As a **Registered User**, I want to **log in with my email and password**, so that **I can access my private dashboard.**
* **Acceptance Criteria:**
    * Issues a JWT for session management.
    * Handles incorrect credentials with clear errors.
    * Maintains login state on page refresh.

---

### 2. Product Catalog
**US3: Browse and Search Products**
As a **Customer**, I want to **search and filter products**, so that **I can find specific items quickly.**
* **Acceptance Criteria:**
    * Real-time filtering by product name.
    * Ability to filter items by specific categories.
    * Product cards display image, price, and title.

**US4: Product Details View**
As a **Customer**, I want to **view detailed information about a product**, so that **I can decide if it meets my requirements.**
* **Acceptance Criteria:**
    * Displays full description and stock status.
    * Functional "Add to Cart" button.

---

### 3. Shopping Cart & Checkout
**US5: Manage Shopping Cart**
As a **Customer**, I want to **add and remove items in my cart**, so that **I can prepare my order before paying.**
* **Acceptance Criteria:**
    * Ability to change item quantities in the cart.
    * Automatic calculation of totals.
    * Data persists in local storage.

**US6: Complete Purchase (Checkout)**
As a **Customer**, I want to **provide shipping and payment details**, so that **I can finalize my order.**
* **Acceptance Criteria:**
    * Validates shipping address and phone number.
    * Saves order to database with "Pending" status.
    * Displays order confirmation number.

---

### 4. Seller & Admin Dashboards
**US7: Inventory Management (Seller)**
As a **Seller**, I want to **add and edit my product listings**, so that **I can sell them on the platform.**
* **Acceptance Criteria:**
    * Supports image uploads and price setting.
    * Restricts view to only the seller's own products.

**US8: User & Content Control (Admin)**
As an **Admin**, I want to **manage user accounts and site categories**, so that **I can maintain the platform.**
* **Acceptance Criteria:**
    * Ability to view all registered users.
    * CRUD functionality for product categories.
    * Ability to deactivate user accounts.

---

### Feature Dependency Map

| Story | Blocked By | Priority |
| :--- | :--- | :--- |
| **US6: Checkout** | US2: Login | High |
| **US7: Inventory** | US2: Login | Medium |
| **US3: Search** | None | High |
