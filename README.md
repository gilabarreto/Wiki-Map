# Spud Spotter

Midterm project for Lighthouse Labs. It's a Google Maps API app based where I practice my frontend and back-end skills, and also Node, SQL, Javascript and jQuery

## Getting Started

0. Create potato database on Postgres: `CREATE DATABASE potato`
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `YOU_USERNAME` 
  - password: `YOUR_PASSWORD` 
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
