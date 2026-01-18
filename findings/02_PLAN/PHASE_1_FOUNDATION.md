# Phase 1: Foundation & Standardization

**Goal:** Establish the necessary tooling and standards to support rigorous engineering practices.

## Module 1: Backend Tooling
### Steps
1.  **Install Test Runner**
    - [ ] Install `vitest` or `jest` in `backend/`.
    - [ ] Configure test scripts in `package.json`.
    - [ ] Create `backend/tests` directory.
2.  **Linting & Formatting**
    - [ ] Install `eslint` and `prettier` in `backend/`.
    - [ ] Configure `.eslintrc` and `.prettierrc`.
    - [ ] Add `lint` and `format` scripts to `package.json`.
    - [ ] Run linting and fix initial issues.

## Module 2: Frontend Tooling
### Steps
1.  **Install Test Runner**
    - [ ] Install `vitest` and `jsdom` in `frontend/`.
    - [ ] Configure `vite.config.js` for testing.
    - [ ] Create `frontend/src/__tests__` directory or setup co-located tests pattern.
2.  **Linting Verification**
    - [ ] Verify existing `eslint` configuration is sufficient.
    - [ ] Add `prettier` for consistent formatting.

## Module 3: Project Structure
### Steps
1.  **Standardize Config**
    - [ ] Create a `config/` directory in backend.
    - [ ] Move environment variable loading to a centralized config loader.
    - [ ] Replace hardcoded ports/URLs with config references.
