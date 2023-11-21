# DataPrompters: Natural Language Query Interface for Databases

DataPrompters is a web application that simplifies database interaction through natural language queries. It provides users with an intuitive interface to retrieve insights from databases without the need for complex SQL queries.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)

## Overview

DataPrompters facilitates seamless communication with databases using natural language queries. It translates user inputs into SQL queries, executes them on the serverless backend, and presents the results in an easy-to-understand format.

## Key Features

- **Natural Language Processing (NLP):** Translate human language queries into SQL for efficient database interaction.
- **Serverless Backend:** Utilizes AWS Lambda for scalable and cost-effective query execution.
- **Database Integration:** Connects with AWS RDS to manage data storage and retrieval.
- **User-Friendly Frontend:** Developed using Next.js and Tailwind CSS for a responsive and visually appealing interface.
- **Continuous Deployment:** Implements continuous deployment with Vercel and AWS Amplify for seamless updates.

## Technologies Used

- Next.js
- Tailwind CSS
- AWS Lambda
- AWS RDS
- Natural Language Processing (NLP)
- Vercel
- AWS Amplify

## Getting Started

To get started with DataPrompters locally, follow these steps:

1. Clone the repository: `git clone [repository_url]`
2. Install dependencies: `npm install`
3. Set up your AWS credentials and configure the database connection.
4. Run the application: `npm run dev`

## Project Structure

The project structure is organized as follows:

```
├── components/
├── hooks/
├── pages/
├── styles/
├── utils/
├── .env.example
├── globals.css
├── next.config.js
├── package.json
└── README.md
```

- `components/`: React components used in the application.
- `hooks/`: Custom React hooks.
- `pages/`: Next.js pages.
- `styles/`: Stylesheets using Tailwind CSS.
- `utils/`: Utility functions.
- `.env.example`: Example environment variables file.
- `globals.css`: Global styles.
- `next.config.js`: Next.js configuration.
- `package.json`: Node.js dependencies and scripts.

## How to Contribute

If you would like to contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.
