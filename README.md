<h1 align="center">Welcome to controlled-promise-list 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Iterate through a list of promises and run them with a controlled concurrency.

## Install

```sh
yarn add controlled-promise-list
```
Or with NPM :
```sh
npm install controlled-promise-list
```
## Usage

```javascript
import controlledPromiseList from 'controlled-promise-list';

const data = [ 1, 2, 3, 4, 5 ];

// Number of promises that run at the same time, 
// here only 2 promises will run concurrently.
const concurrentRunNumber = 2;

// The list contain promise functions ready to be use for a Promise instantiation.
const promiseFunctionList = data.map((x) => {
    return (resolve, reject) => {
        setTimeout(() => {
            resolve(x * x)
        }, between(1000, 3000))
    }
});

// This function is run after each batch of promises,
// here it's run each time when 2 promises finish.
const onProgress = (doneCount, remainingCount) => {
   console.log(doneCount + '/' +remainingCount);
}

controlledPromiseList(
    promiseFunctionList,
    concurrentRunNumber, 
    onProgress
)
.then((results) => {
    console.log(results); // [ 1, 4, 9, 16, 25 ]
})
.catch((error) => {
    // if one of the function in promiseFunctionList reject, 
    // controlledPromiseList stops and throw the error so it can be catch.
});
```

Notice : if you set ```concurrentRunNumber``` to 1, it will run each promise sequentially. 

## Development

### Setup

1) Clone this repository
2) ```yarn install```

### Run tests

```sh
yarn test
```

## Author

👤 **Ravidhu Dissanayake**

* Website: ravidhu.com
* Github: [@ravidhu](https://github.com/ravidhu)
* LinkedIn: [@ravidhu](https://linkedin.com/in/ravidhu)

## Show your support

Give a ⭐️ if this project helped you!
