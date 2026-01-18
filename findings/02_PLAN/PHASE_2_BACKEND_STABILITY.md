# Phase 2: Backend Stability

**Goal:** Ensure the core business logic and data persistence layers are correct and regression-proof.

## Module 1: Unit Testing
### Steps
1.  **Memory Service**
    - [ ] Test `createThread` and `getThread`.
    - [ ] Test `addMessage` and token counting logic.
    - [ ] Test `getMessages` context window logic (limit handling).
    - [ ] Test migration system (idempotency).
2.  **Chat Service**
    - [ ] Mock Ollama API response.
    - [ ] Test `generateStream` logic.
    - [ ] Test error handling during stream interruption.

## Module 2: Integration Testing
### Steps
1.  **API Endpoints**
    - [ ] Test `POST /api/v1/chat` with valid payload.
    - [ ] Test `POST /api/v1/chat` with missing fields (validation).
    - [ ] Test `GET /api/v1/threads` pagination/sorting.
    - [ ] Test `DELETE /api/v1/threads/:id`.

## Module 3: Controller Refactoring
### Steps
1.  **Dependency Injection**
    - [ ] Refactor `ChatController` to accept services as arguments (or use a container).
    - [ ] Remove direct `import` of `MemoryService` inside methods if possible.
