# Training Management Web App

This project consists of a frontend and backend service for a training management application, along with a MySQL database. The services are containerized using Docker and managed with Docker Compose.

The application is developed using MySQL for the database, Express and Node.js for the backend, and React with TypeScript for the frontend.

**Note:** This application is still a work in progress.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## DEVELOPMENT SETUP

1. **Clone the repository:**
   ```
   git clone <repository_url>
   cd TrainingMgmtWebApp
   ```
2. **Create a .env file in the root/backend directory with the following content:**
   ```
   MYSQL_HOST=localhost
   MYSQL_USER=<your_mysql_username>
   MYSQL_PASSWORD=<your_mysql_password>
   MYSQL_DATABASE=training_app
   ```
3. **Setup initial MySQL Database with preset data**
   ```
   mysql -u <your_mysql_username> -p
   <your_mysql_password>
   USE training_app;
   source <path to repo file>\TrainingMgmtWebApp\sql\schema.sql
   ```
4. **Run backend and frontend on separate terminals**
   ```
   npm run dev
   ```

## DOCKER DEPLOYMENT SETUP

1. **Clone the repository:**
   ```
   git clone <repository_url>
   cd TrainingMgmtWebApp
   ```
2. **Create a .env file in the root directory with the following content:**

   ```
   MYSQL_HOST=mysql
   MYSQL_USER=<your_mysql_username>
   MYSQL_PASSWORD=<your_mysql_password>
   MYSQL_DATABASE=training_app
   ```

   _Replace <your_mysql_username> and <your_mysql_password> with your desired MySQL username and password._

3. **Build and start the Docker containers:**

   ```
   docker-compose up --build
   ```

   _This will build and start the frontend, backend, and MySQL services._

4. **The file contains a schema.sql on how to setup the database.**
   ```
   mysql -u <your_mysql_username> -p
   <your_mysql_password>
   USE training_app;
   source <path to repo file>\TrainingMgmtWebApp\sql\schema.sql
   ```

## Accessing the Application

- Backend: The backend service runs on http://localhost:3000
  - The following api access are available: '/employees'
- Frontend: Open your browser and navigate to http://localhost:5001 (home page)
  - To access employee page, navigate to http://localhost:5001/employees

## Stopping the Application

To stop the application, run:

```
docker-compose down
```

## Running SQL Queries

To run SQL queries directly on the MySQL database:

1. Open Docker Dashboard and find the container running MYSQL.

2. Click on the actions button and click open in terminal to open a command-line interface within the container.

3. Run the MySQL command-line client:
   ```
   mysql -u root -p
   <your_mysql_password>
   USE training_app;
   SHOW TABLES;
   ```
   _Enter the root password (as specified in .env):_

## Contributing

1. **Clone the repository:**

   ```
   git clone <repository_url>
   cd TrainingMgmtWebApp
   ```

2. **Create a new branch for you to work on. The main branch is protected, so you cannot push directly to it:**
   ```
   git checkout -b <your_branch_name>
   ```
3. **Commit your changes with a clear and descriptive commit message:**

   ```
   git add .
   git commit -m "Describe your changes"
   ```

4. **Push your changes to the remote repository:**
   ```
   git push origin <your_branch_name>
   ```
5. **Before creating Pull Request, rebase and sync up with main branch**
   ```
   git checkout <your-feature-branch>
   git fetch origin
   git rebase origin/main
   
   # Resolve any conflicts that may arise during the rebase process
   # Manually resolve conflicts and then continue the rebase
   git rebase --continue

   # (only if you have already pushed your branch before)
   git push origin <your-feature-branch> --force
   ```
7. **Create a Pull Request:**

   Go to the repository on GitHub and click on the "New Pull Request" button. Select your branch and compare it to the base branch (main). Create the pull request and provide a description of your changes.

8. **Review and Merge:**

   Once your pull request is reviewed and approved, it will be merged into the main branch.

Note: Since the main branch is protected, all changes must go through a pull request and be reviewed before they are merged.
