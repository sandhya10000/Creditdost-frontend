---
trigger: always_on
---
Maintain separation of concerns:

Controllers → request/response only

Services → business logic

Repositories → DB access

Middleware → auth/validation
Never mix business logic inside controllers.
Never directly access DB inside controllers.