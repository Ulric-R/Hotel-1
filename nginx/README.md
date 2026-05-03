# Nginx — Reverse proxy + Basic Auth

This Nginx instance:

1. Serves the React build (`dist/`) for the public site.
2. Proxies `/api/*` to the FastAPI backend.
3. **Protects `/admin` and `/api/admin/*` with HTTP Basic Auth** — the browser
   shows its native credential popup, so no in-app login page is needed.

## Default credentials

```
user:     admin
password: Fanja2026
```

## Generate a new password

Install `apache2-utils` (Debian/Ubuntu) or `httpd-tools` (RHEL), then:

```bash
htpasswd -c nginx/.htpasswd admin           # create new file with user 'admin'
htpasswd     nginx/.htpasswd marie          # add another user
```

If `htpasswd` is unavailable you can use Docker:

```bash
docker run --rm httpd:2.4-alpine htpasswd -nb admin mypassword > nginx/.htpasswd
```

## How clients authenticate

The browser sends `Authorization: Basic base64(user:pass)` automatically once
the user has filled the popup. Nginx validates against `.htpasswd`, then
forwards `X-Remote-User: <username>` to the FastAPI backend so it can log
who performed each admin action.
