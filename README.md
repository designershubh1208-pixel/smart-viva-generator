<div align="center">

# 🧠 Smart Viva Generator
**AI-Powered Mock Interviews & Real-Time Feedback**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![NVIDIA AI](https://img.shields.io/badge/AI-NVIDIA%20Llama%203-76B900?style=flat&logo=nvidia)](https://build.nvidia.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🚀 Overview
**Smart Viva Generator** is a next-generation, AI-driven educational platform designed to help students prepare for exams. By simply uploading study materials (PDFs, presentations, etc.), the platform leverages the power of **NVIDIA's Llama 3 70b** to instantly generate personalized viva questions, conduct interactive mock interviews, and provide actionable real-time feedback.

<br/>

## ✨ Key Features
- 🤖 **AI-Generated Questions:** Instantly extracts key concepts from your study materials to formulate high-quality viva questions.
- 🎙️ **Interactive Mock Interviews:** Simulates a real exam environment with text-to-speech and real-time AI grading.
- 📊 **Smart Dashboard:** Track your progress, review past sessions, and identify weak topics.
- ⚡ **Premium UI/UX:** Built with a stunning, high-fidelity "Liquid Glass" design system, completely responsive for all devices.
- 🔒 **Secure Architecture:** Robust NestJS backend using Prisma ORM and PostgreSQL for secure user data management.

<br/>

## 🛠️ Tech Stack
This project is structured as a modern **Monorepo** containing a frontend client, a backend API, and a shared types package.

### **Frontend**
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion
- **Icons:** Lucide React

### **Backend**
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI Integration:** NVIDIA NIM API (Llama 3 70b)

<br/>

## 📂 Project Structure
```text
smart-viva-generator/
├── frontend/                 # Next.js Application (Client-side)
│   ├── src/app/              # App Router pages (Dashboard, Viva, Landing)
│   ├── src/components/       # Reusable UI components
│   └── public/               # Static assets & illustrations
├── backend/                  # NestJS API (Server-side)
│   ├── src/ai/               # NVIDIA API integration modules
│   ├── src/uploads/          # File processing & storage handling
│   └── prisma/               # Database schema & migrations
└── packages/                 # Shared Monorepo packages
    └── common-types/         # Shared TypeScript interfaces (Frontend & Backend)
```

<br/>

## 💻 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)
- An [NVIDIA Developer](https://build.nvidia.com/) Account (for the API Key)

### 1. Clone the repository
```bash
git clone https://github.com/designershubh1208-pixel/smart-viva-generator.git
cd smart-viva-generator
```

### 2. Setup the Backend
```bash
cd backend
npm install

# Set up your environment variables
# Ensure your .env contains DATABASE_URL and NVIDIA_API_KEY
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Start the NestJS server
npm run start:dev
```
*The backend will be running at `http://localhost:3001`*

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install

# Start the Next.js development server
npm run dev
```
*The frontend will be running at `http://localhost:3000`*

<br/>

## 🎨 Design System
The frontend implements a modern **"Liquid Glass"** aesthetic. It utilizes custom Tailwind configurations, backdrop blurring, sophisticated Framer Motion stagger animations, and a seamless light theme designed for maximum readability and premium SaaS feel.

<br/>

URL - https://smart-viva-generator-frontend.vercel.app/

## 📝 License
This project is licensed under the MIT License.
