# Spud Spotter

A midterm project for Lighthouse Labs, built using Node, SQL, Javascript, and jQuery, utilizing the Google Maps API to allow users to create, edit, and favorite their favorite potato restaurants.

## Final Product

https://user-images.githubusercontent.com/92469359/213012218-f2b66907-88ed-4e4d-8ad7-64e1bb71ba69.mp4

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
