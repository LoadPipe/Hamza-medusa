<img src="branding/hamza.png" height="70"/>    
<img src="branding/LoadPipeGray.png" height="50"/>

[![website](https://img.shields.io/badge/website-blue)](https://hamza.market) [![website](https://img.shields.io/badge/dev_site-red)](https://hamza.market) [![ethglobal](https://img.shields.io/badge/eth-london-green)](https://ethglobal.com/showcase/hamza-u5dm7)

### Setup Quick Start

1. Clone this Repository
2. Create the .env files
3. Install Packages with yarn
4. Install the Medusa CLI
5. Set up the Database
6. Run the Currency Conversion API 
7. Run medusa seed & migrations
8. Run the Server
9. Run the Client

**1. Clone this Repository**

git clone

**2. Create the .env files**

./hamza-server/.env
./hamza-server/scripts/.env
./hamza-client/.env.local

See /hamza-server/.env.example 
See /hamza-server/scripts/.env.example 
See /hamza-client/scripts/.env.local.example 

**3. Install Packages with yarn**

```
cd ./hamza-server
yarn install
cd ../hamza-client
yarn install
cd ../currency-conversion
yarn install
cd ../hamza-server/scripts
yarn install
```

**4. Install the Medusa CLI**

```
yarn global add @medusajs/medusa-cli
```

**5. Set up the Database**

Setup will do this for you in the next step. Just make sure that you are not running anything (e.g. postgres) on the default postgresql port (5432), nor on the default redis port .

**6. Run the Currency Conversion API**

```
cd ./currency-conversion
yarn start
#just leave it running
```


**7. Set up and Run the Server**

```
cd ./hamza-server
yarn setup-0
# WAIT for the server to start listening on port 9000
yarn setup-1
# at this point, you can shut the server down if you wish
```

```
cd ./hamza-server
yarn start
```

**8. Run the Client**

** In a new Terminal: **

```
cd ./hamza-client
yarn import-currencies  #only needs to be done once, until node_modules is cleaned
yarn build
yarn start
```

**9. Other Helpful Scripts**

**Backend:**

```
# removes node_modules, build, dist, and .cache
yarn clean

# removes node_modules, build, dist, .cache and yarn.lock/package-lock.json
yarn deepclean

# removes build & dist, and .cache
yarn softclean

# removes database entirely
yarn nuke
```

**Frontend:**

```
# removes node_modules, .next
yarn clean

# removes node_modules, .next, and yarn.lock/package-lock.json
yarn deepclean

# removes .next
yarn softclean

```

### Docker Cheat Sheet (WIP) - G

**We can either do `docker-compose` or `docker compose` (the `-` is optional)**

1. docker compose up -d

**This is nice to clean up everything, but be careful, it will remove all volumes and images)** 2. docker compose down --volumes --rmi all

**Find all running containers** 3. docker ps

**Show container logs** 4. docker logs <container-name>

## Notes

To set up from scratch:
https://docs.medusajs.com/create-medusa-app
Run: `npx create-medusa-app@latest`
Automatically created thepostgres database and the admin user through the cli

### Project Structure

**Backend**: hamza-server/
Environment Variable: _.env_

**Frontend**: /hamza-client
Environments Variable: _env.local_

For Postgres database we can create entities in load-pipe/src/models
[Medusa uses TypeORM ](https://docs.medusajs.com/development/entities/overview) ... adding entities to this folder will automatically register them in the database.

### Payment Architecture:

[E-commerce.pdf](/E-commerce.pdf) in root of repo has a diagram of the [payment architecture](https://docs.medusajs.com/modules/carts-and-checkout/payment)

```

```
