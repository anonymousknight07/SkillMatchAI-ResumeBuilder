# Skill Match AI
![image](https://github.com/user-attachments/assets/579ee829-427e-4fa7-b61c-f6c4ac30cdd2)

Skill Match AI is a web application that helps users draft and create resumes tailored to specific job positions using AI-powered insights. By analyzing the job description and user-provided data, Skill Match AI suggests skills, keywords, and content to enhance the user's resume, making it more competitive and relevant for the desired role.

## Features

- **AI-Powered Resume Suggestions**: Leverages artificial intelligence to provide suggestions based on the job description, enhancing the quality and relevance of the resume.
- **Customizable Resume Template**: Allows users to input their information and adjust the structure to their preferences.
- **Skill and Keyword Matching**: Highlights key skills and keywords needed for the job, ensuring that the resume aligns with employer expectations.

## Project Structure

The project has the following structure:

- **`app/`**: Contains core application code for handling user interactions and resume generation.
- **`components/`**: Contains UI components for modular and reusable code within the application.
- **`lib/`**: Contains utility functions and libraries used across the application.
- **`public/`**: Houses static assets such as images and icons.
- **Configuration Files**:
    - `.gitignore`: Specifies files and directories to ignore in version control.
    - `components.json`, `middleware.ts`, `next.config.mjs`: Various configuration and setup files for the application.
    - `package.json`, `package-lock.json`: Package management files that specify dependencies.
    - `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`: Configuration for Tailwind CSS, PostCSS, and TypeScript.

## Setup Instructions

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/skill-match-ai.git cd skill-match-ai 
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the application**:
```bash
npm run dev
```

4. **Build the application for production**:
```bash
npm run build
```
## Contributing

Contributions are welcome! Please create an issue to discuss the feature or bug before creating a pull request
