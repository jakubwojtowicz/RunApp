# Running App - ASP.NET Core + React

## Project Description

This is a personal project I started when I began running. As my running journey evolves, so does this application. It's designed to help me track my training plans, monitor progress, and organize future runs. The backend is built with ASP.NET Core, and the frontend is developed in React with TypeScript. Data is stored in a local SQLite database.

## Current Application Features

* View current training plan
* History of completed runs
* Plan future training sessions
* Synchronize data with a local SQLite database

## Screenshots 
Home Page:
<img width="1570" height="871" alt="image" src="https://github.com/user-attachments/assets/6da717b0-f53f-4b13-9b8f-2f3f95ece609" />
Training Plan Page:
<img width="1575" height="870" alt="image" src="https://github.com/user-attachments/assets/565eb0bc-8c65-4031-b792-72eb5fd2cde2" />


## Prerequisites

* [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download)
* [Node.js (v18+)](https://nodejs.org/)

## Installation and Running

### 1. Prepare the Frontend (React)

```bash
cd ClientApp
npm install
npm run build
```

The generated frontend files will be placed in `/wwwroot` .

### 2. Publish the Backend

```bash
dotnet publish -c Release -o publish
```

### 3. Running the Application

Navigate to the `publish` folder and run the application:

```bash
cd publish
RunApp.exe
```

Open your browser and go to:

```plaintext
http://localhost:7125
```




Contact: j.wojtowicz0105@gmail.com

