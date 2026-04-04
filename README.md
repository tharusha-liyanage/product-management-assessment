# Product Management Dashboard

A modern, responsive, client-side product management dashboard built with Next.js and Tailwind CSS. This application allows users to seamlessly manage a product inventory with advanced features like bulk actions, real-time analytics, and dark mode, all persisted locally in the browser.

## 🚀 Features

* **Full CRUD Functionality:** Add, edit, view, and delete products.
* **Advanced Data Pipeline:** Real-time search, sorting (by name or price).
* **Bulk Actions:** Select multiple items to delete them simultaneously.
* **Image Uploads:** Upload local images, which are converted to Base64 and stored directly in the browser.
* **Real-time Analytics:** Top-level cards displaying Total Products, Items Missing Images, and the Highest Price in the catalog.
* **Responsive Design:** Displays a high-density data table on desktop, and seamlessly flips to a beautiful "Card" layout on mobile devices.
* **Premium UI/UX:** Features glassmorphism headers, soft drop shadows, micro-interactions, toast notifications, and a fully custom dark mode theme.

---

## 🛠️ Tech Stack Used

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Accessible, customizable components)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
* **Data Persistence:** Browser Local Storage (Custom React Hooks)

---

## 💻 Setup Instructions

To run this project locally on your machine, follow these steps:

**1. Clone the repository**
\`\`\`bash
git clone <your-repository-url>
cd <your-project-folder>
\`\`\`

**2. Install dependencies**
Make sure you have Node.js installed. Then run:
\`\`\`bash
npm install
\`\`\`

**3. Run the development server**
\`\`\`bash
npm run dev
\`\`\`

**4. Open the app**
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🧠 Assumptions Made

During the development of this project, the following assumptions and architectural decisions were made based on the project constraints:

1. **Client-Side Storage:** Because a backend database was not required, all data is persisted using the browser's `localStorage` via a custom `useProducts` hook.
2. **Image Handling:** Since there is no cloud storage (like AWS S3) attached, uploaded images are converted to Base64 strings using `FileReader`. 
3. **File Size Limits:** Because `localStorage` has a strict size limit (usually around 5MB), image uploads are restricted to 1MB or less to prevent the app from crashing.
4. **Client Components:** Due to the heavy reliance on browser APIs (`localStorage`, `FileReader`, `window`), the main dashboard and its child components are rendered strictly on the client side using Next.js `"use client"` directives.

---

## 🚀 Future Improvements

If this project were to be scaled for production use, I would implement the following upgrades:

1. **Database Integration:** Migrate data storage from `localStorage` to a robust database like PostgreSQL (via Prisma or Supabase).
2. **Cloud Image Hosting:** Move away from Base64 string storage and implement Amazon S3 or Cloudinary for efficient image uploading and delivery.
3. **Authentication:** Add user login and authorization (e.g., using NextAuth or Clerk) so multiple managers can securely access their own unique inventories.
4. **Data Portability:** Add a feature to allow users to Import and Export their product lists as `.csv` files for use in Excel.