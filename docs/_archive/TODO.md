# TODO LIST TECHNICAL DEBT
- [ ] Refactor backend code to improve maintainability.
1. Client sends `POST /api/auth/login` with credentials.
2. `authController.login()` processes the request.
3. `authService.authenticateUser()` verifies credentials against `backend/data/users.json`.
- [ ] Implement error handling middleware for better error responses across all routes.
4. On success, generate JWT and respond with token.