# Sylvana Hotel — FastAPI Backend

## Local development

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

### Public (read-only)
- `GET  /api/rooms`
- `GET  /api/rooms/{id}`
- `GET  /api/articles`
- `GET  /api/articles/{id}`
- `GET  /api/promos`
- `GET  /api/photos`
- `POST /api/reservations`

### Admin (protected by Nginx Basic Auth)
- `POST/PUT/DELETE /api/admin/rooms[/{id}]`
- `POST/PUT/DELETE /api/admin/articles[/{id}]`
- `POST/PUT/DELETE /api/admin/promos[/{id}]`
- `POST            /api/admin/upload`         (multipart file upload)
- `POST/DELETE     /api/admin/photos[/{id}]`
- `GET/DELETE      /api/admin/reservations[/{id}]`
- `GET             /api/admin/me`

## Authentication strategy

This service is **stateless and does not authenticate users itself**.
All `/api/admin/*` routes are exposed only behind the Nginx reverse proxy
which enforces HTTP Basic Auth. The proxy strips `Authorization` before
forwarding and adds `X-Remote-User` so the API knows who's calling.
```
