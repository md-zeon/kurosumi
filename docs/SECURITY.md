# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within Kurosumi, please send an email to **[INSERT EMAIL]**. All security vulnerabilities will be promptly addressed.

**Please do not report security vulnerabilities through public GitHub issues.**

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under maintenance
4. Release new security versions

## Security Considerations

Kurosumi is a local-first application that stores data in IndexedDB. Key security considerations:

### Data Storage
- All notes are stored locally in your browser's IndexedDB
- No data is sent to external servers
- No accounts or authentication required

### Browser Security
- IndexedDB follows the Same-Origin Policy
- Data is only accessible from the same origin (domain)
- Clearing browser data will delete all notes

### Best Practices
- Export your notes regularly as a backup
- Use the app on trusted devices
- Keep your browser updated
- Be cautious when using shared or public computers

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Update Notifications

Security updates will be announced through:
- GitHub Releases
- Security Advisories on GitHub
