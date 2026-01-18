# Phase 3: Frontend Reliability

**Goal:** Guarantee the UI behaves as expected under various states (loading, error, streaming).

## Module 1: Component Testing
### Steps
1.  **Chat Components**
    - [ ] Test `ChatInput` handles text input and submission.
    - [ ] Test `MessageStream` renders Markdown correctly.
    - [ ] Test `MessageStream` handles empty states.
2.  **Hooks**
    - [ ] Test `useChatStream` state transitions (idle -> streaming -> done).
    - [ ] Test `useChatStream` error handling logic.

## Module 2: Integration/E2E
### Steps
1.  **User Flows**
    - [ ] Verify creating a new chat clears the context.
    - [ ] Verify switching threads loads correct history.
    - [ ] Verify streaming updates the UI in real-time (mocked).

## Module 3: Error Handling UI
### Steps
1.  **Visual Feedback**
    - [ ] Verify "Offline" banner appears when connection drops.
    - [ ] Verify "Retry" button functionality.
