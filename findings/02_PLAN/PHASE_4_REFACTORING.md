# Phase 4: Refactoring & Optimization

**Goal:** Improve code maintainability, performance, and robustness.

## Module 1: Configuration Management
### Steps
1.  **Centralize Constants**
    - [ ] Move LLM model names (`gemma3:4b`) to config.
    - [ ] Move context limits (8192, 20000 chars) to config.
    - [ ] Implement environment-based overrides (DEV vs PROD).

## Module 2: Error Handling Strategy
### Steps
1.  **Global Error Handler**
    - [ ] Implement a global error handling middleware in Express.
    - [ ] Standardize API error responses (JSON structure).
2.  **Logging**
    - [ ] Replace `console.log` with a proper logger (e.g., `winston` or `pino`).
    - [ ] Log structured events for audit trails.

## Module 3: Performance
### Steps
1.  **Database Indexing**
    - [ ] Review `messages` table indexes.
    - [ ] Ensure `thread_id` and `created_at` are indexed for fast retrieval.
2.  **Frontend Bundling**
    - [ ] Analyze bundle size.
    - [ ] Implement code splitting if necessary (lazy load routes).
