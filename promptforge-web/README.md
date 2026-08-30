# PromptForge Web Application

Welcome to the PromptForge Web Application! This project is built with TypeScript and React, aimed at providing an intuitive platform for users to create and manipulate prompts efficiently.

## Features
- **User Authentication:** Secure login and registration process.
- **Prompt Management:** Create, edit, delete, and manage your prompts effortlessly.
- **Real-time Preview:** Instant feedback as you create or modify prompts.
- **Responsive Design:** Fully responsive interface to work seamlessly on various devices.

## Tech Stack
- **Frontend:** React, TypeScript, CSS Modules
- **Backend:** Node.js, Express.js (if applicable)
- **Database:** MongoDB / PostgreSQL (choose as necessary)
- **Deployment:** Vercel / Netlify / Custom server (depending on deployment strategy)

## Getting Started
To get started +++++++makewith the PromptForge application:
1. Clone the repository:
   ```bash
   git clone https://github.com/matysekprogramuje/promptforge-web.git
   cd promptforge-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Waitlist emails

Waitlist signups are stored in the Supabase `public.waitlist` table through `POST /api/waitlist`.

To send a confirmation email after signup, configure Resend:

```bash
RESEND_API_KEY=re_your_resend_key
WAITLIST_FROM_EMAIL="PromptForge <hello@promptforge.ai>"
```

If `RESEND_API_KEY` is missing, the signup is still saved and the API returns `email_sent: false`.

## Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get involved.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support, please open an issue on GitHub or contact the project maintainers directly.

Happy Coding!
