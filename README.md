 
<div align="center">
   <p align="center">
     <picture>
       <source media="(prefers-color-scheme: dark)" srcset="public/eeci-logo-white.svg">
       <source media="(prefers-color-scheme: light)" srcset="public/eeci-logo-black.svg">
       <img src="public/eeci-logo-black.svg" alt="EECI Logo" width="240">
     </picture>
   </p>

  # Ethiopian Enterprise Cyber Intelligence (EECI)

  **Assess. Manage. Continuously Improve Your Organization's Security.**

  A cybersecurity platform designed to help Ethiopian organizations assess their security posture, manage security-related activities, and strengthen their organizational security.

  [**Explore the Live Platform**](https://insa-eeci.vercel.app/)

  <br />

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![daisyUI](https://img.shields.io/badge/daisyUI-5-1AD1A5?logo=daisyui&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Database-Neon-00E599?logo=neon&logoColor=black)
![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)
![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-black?style=flat-square&logo=betterauth&logoColor=white)
![Supabase Storage](https://img.shields.io/badge/Storage-Supabase-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&logoColor=white)
![MVP](https://img.shields.io/badge/Project-MVP-informational)

</div>

---

## Project Team

EECI is developed by a team with complementary cybersecurity specializations.

| Team Member | CTC ID | Specialization | Role |
|---|---|---|--|
| **Dagmawi Kebede Yesuf** | CTC-5419-26 | Cybersecurity Engineer | Project Manager |
| **Reyan Ahmed Uso** | CTC-2569-26 | Firmware Security Engineer | Project Team |
| **Biniyam Birhanu Hadgu** | CTC-5561-26 | Cybersecurity Analyst | Project Team |

## Overview

It is a web platform where Ethiopian companies create an organizational security profile and integrate relevant cybersecurity data and compliance information. Then the platform enables organizations to continuously assess and strengthen their organizational security posture with the integrated security compliance assessment and defensive capabilities, including incident reporting, vulnerability assessment, authorized penetration testing and controlled red-team engagement. With integrated AI features.

**Demonstration Video:** https://github.com/dagmawi-kebede-official/eeci/tree/main/video

**Live Demo:** https://insa-eeci.vercel.app/

## Core Features

### Compliance Assessment
Assess organizational security through structured questionnaires that help identify potential weaknesses and improvement areas. Complete compliance-oriented assessments, record responses, and maintain assessment information to support an organization's security and compliance activities.

### Incident Reporting and Management
Create and manage security incident reports, document affected systems and departments, track relevant details, and attach supporting evidence. Upload supporting incident evidence using Supabase Storage, with private storage and controlled access to uploaded files.

### Security Testing Management
Submit security testing requests and maintain booking information, including testing scope and scheduled dates.

### Centralized Dashboard
Access the platform's security-related features through a centralized interface, providing a foundation for more integrated security management.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application and server-side functionality |
| React | Interactive user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Utility-first styling |
| daisyUI | UI components and styling utilities |
| PostgreSQL | Relational database |
| Neon | Hosted PostgreSQL database |
| Prisma ORM | Database access and data modeling |
| Better Auth | User authentication and session management |
| Supabase Storage | Private incident evidence storage |
| Vercel | Application deployment |

## Project Structure

The main parts of the application are organized as follows:

```text
eeci/
├── app/
│   ├── actions/          # Server actions
│   ├── api/              # API routes
│   ├── components/       # Reusable UI components
│   ├── hooks/            # React hooks
│   ├── lib/              # Authentication and service utilities
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Dashboard and report workflows
│   ├── compliance/       # Compliance assessment pages
│   ├── security/         # Security testing workflows
│   └── page.tsx          # Landing page
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── prisma.config.ts      # Prisma configuration
└── README.md
```

*This is a high-level overview; individual routes and folders may evolve as the project develops.*

## Roadmap

EECI is designed to evolve beyond its initial MVP. Planned improvements include:

- **AI Security Assistant:** An AI-powered assistant to explain security findings, answer cybersecurity-related questions, and help organizations explore remediation recommendations.
- **Ethiopian Language Support:** Reviewed translations to make the platform more accessible to users in Amharic, Afaan Oromo, and other relevant local languages.
- **Accessibility Enhancements:** Improved screen-reader support, keyboard navigation, read-aloud functionality, and accessible interaction patterns.
- **Continuous Security Improvement:** Further integration of security assessment results, compliance information, and incident management to support ongoing improvement.

These are planned capabilities and should not be considered available in the current release unless implemented and enabled.

---

<div align="center">

  **Ethiopian Enterprise Cyber Intelligence**

  *Strengthening organizational security through structured assessment, management, and continuous improvement.*

  [Visit EECI](https://insa-eeci.vercel.app/)

</div>
