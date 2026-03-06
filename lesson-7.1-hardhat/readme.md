
cd /Users/kairattalantbekov/Desktop/web3-intro/lesson-7.1-hardhat

# run all node:test + viem tests
npx hardhat test

# or only this file
npx hardhat test test/Test.js

----------------------------------

# deploy HelloWorld, Counter, Owned
npx hardhat run scripts/deploy.js

# interact with existing HelloWorld
npx hardhat run scripts/actionHelloWorld.js

# interact with existing Counter
npx hardhat run scripts/actionCounter.js

# interact with existing Owned
npx hardhat run scripts/actionOwned.js