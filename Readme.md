# Terrestrial

A modern, responsive web application for monitoring land degradation, built with cutting-edge technologies. This project showcases a seamless user experience with a focus on performance and design.

**Live Demo:** **https://terrestrial.vercel.app/**

## ✨ Features

*   **Responsive Design:** Looks great on all devices, from mobile phones to desktops.
*   **Interactive UI:** A smooth and engaging user interface built with modern frontend frameworks.
*   **User Authentication:** Secure login and registration functionality.
*   **Data Visualization:** Interactive charts and maps to visualize land degradation data.
*   **Real-time Updates:** Get the latest information with real-time data streams.

## 🛠️ Tech Stack

This project is built using the following technologies:

*   **Frontend:** React.js / Next.js
*   **Styling:** Tailwind CSS
*   **Language:** TypeScript
*   **Scripting:** Python (for data processing/analysis)
*   **Backend:** Next.js API Routes
*   **Database:** Supabase (PostgreSQL)
*   **Deployment:** Vercel

## 🚀 Getting Started & Local Deployment

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

*   Node.js (v18.x or later recommended)
*   npm (or Yarn/pnpm)

### Installation

1.  **Clone the repository**
    Open your terminal and run the following command. 
    ```bash
    git clone https://github.com/ifih/terrestrial.git
    ```

2.  **Navigate to the project directory**
    ```bash
    cd terrestrial
    ```

3.  **Install dependencies**
    This will install all the necessary packages for the project.
    ```bash
    npm install
    ```
    *(or `yarn install` or `pnpm install`)*

4.  **Set up environment variables**
    Create a new file named `.env.local` in the root of your project. Copy the contents from `.env.example` (if it exists) or add the necessary environment variables.

    Here is an example of what your `.env.local` file might look like:
    ```
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

    # NextAuth.js
    NEXTAUTH_SECRET="your_super_secret_key_for_authentication"
    NEXTAUTH_URL="http://localhost:3000"

    # Google Provider for NextAuth.js
    GOOGLE_CLIENT_ID="your_google_oauth_client_id"
    GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
    ```

5.  **Run the development server**
    Now, you can start the local development server.
    ```bash
    npm run dev
    ```
    *(or `yarn dev` or `pnpm dev`)*

6.  **View the application**
    Open your browser and navigate to http://localhost:3000 to see the application in action!

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` file for more information.
