# salute-service-v1.2
API with Microservices architecture. For first publishing (14.11.2021) there are 3 services: Auth Service, User Service, Photo Service.

How to run the project:
git clone

### Auth service:
1. cd ./auth
2. create mongo db with such config ./salute-service-v1.2/auth/db/migrate-mongo-config.js (fe db name: 'salute-auth') 
3. npm run migration:up
4. npm start
Env vars auth/tmp.env (DATABASE_URL, DATABASE_NAME doesn't work now, you should use settings from db config file. Maybe it'll be fixed in the near future but FOR NOW better don't ask me about it)
Db auth/db

### User service:
1. cd ./user
2. create postgres db
3. npm run migration:up
4. npm start
Env vars user/tmp.env 
Db user/db

### Photo service:
1. cd ./photo
2. create postgres db
3. npm run migration:up
4. npm start
Env vars photo/tmp.env 
Db photo/db
