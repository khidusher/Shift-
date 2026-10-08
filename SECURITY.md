# Security

The SHIFT 1.0 website is a static site. It currently has no account system, API, form submissions, database, or analytics integration. Its production deployment is configured for Vercel; production headers are defined in `vercel.json`.

## Reporting a vulnerability

Please report security issues to **[OFFICIAL SECURITY CONTACT]**. WES must replace this placeholder with a monitored contact before publication. Include the affected page, a concise description, and steps to reproduce. Do not include other visitors’ personal information or publicly disclose an unpatched issue.

## Secrets and deployment

- Do not commit `.env` files, credentials, private keys, or service-account files. The repository `.gitignore` excludes these file types.
- Any secret required by a future server-side feature must stay in server-only deployment environment variables. Values included in browser-delivered HTML, CSS, JavaScript, or `NEXT_PUBLIC_`/`VITE_` variables are public.
- Review the Vercel project’s access controls, deployment settings, logs, and environment variables before production use.
- If a credential is ever committed, revoke or rotate it; removing it from the current files does not remove it from Git history.

This document describes the current project structure and is not a security guarantee.
