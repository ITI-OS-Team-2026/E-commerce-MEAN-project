# E-commerce-MEAN-project
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