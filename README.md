# saasify-importer

### Getting start

Preparation
```shell
git clone https://github.com/jakednoh/pixo-test-api && cd pixo-test-api
npm i
```

To run api on (localhost:8080)
```shell
npm run start:docker
```

To run Unit test
```shell
docker run --name mongo-soy-sauce -p 27017:27017 -d mongo:latest
npm run test
   ```