# test-electric

Basic Network
1.startFabric

composer archive create -t dir -n .



app/persistence/fabric/postgreSQL/db/createdb.sh 


Try this :
composer network install --card PeerAdmin@hlfv1 --archiveFile test-electric@0.6.0.bna

And then :

composer network start --networkName test-electric --networkVersion 0.6.1 --card PeerAdmin@hlfv1 --networkAdmin admin --networkAdminEnrollSecret adminpw --file networkadmin.card
// creates admin card




composer network install --card PeerAdmin@hlfv1 --archiveFile test-bank.bna

composer network upgrade -c PeerAdmin@hlfv1 -n test-electric -V 0.4.6



	Card file: networkadmin.card
	Card name: admin@test-electric


composer card delete --card admin@test-electric

composer card import --file networkadmin.card

composer network ping --card admin@test-bank

// Restart Rest-server
composer-rest-server -c admin@test-bank 

https://chaincodedevs.com/showthread.php?tid=41

https://www.freecodecamp.org/news/ultimate-end-to-end-tutorial-to-create-an-application-on-blockchain-using-hyperledger-3a83a80cbc71/







composer-rest-server for creating the rest-server

composer card create -u usr001 -s <enrollment_secret> -f usr001.card -n tutorial-network -p connection.json

cd ~/fabric-dev-servers
export FABRIC_VERSION=hlfv12
./downloadFabric.sh




  docker kill $(docker ps -q)
    docker rm $(docker ps -aq




Generating a REST API with an APIKEY
An API key can be used to provide a first layer of security to access the REST API in development environment.

Copy
composer-rest-server -y YOUR_API_KEY
This will accept only request with an Header x-api-key set with the value of YOUR_API_KEY.


https://medium.com/hyperlegendary/how-to-build-nodejs-application-for-your-hyperledger-composer-networks-2b08ff25665f



composer archive create --sourceName digitalproperty-network --sourceType module --archiveFile digitalPropertyNetwork.bna



    cd ~/fabric-dev-servers
    export FABRIC_VERSION=hlfv12
    ./startFabric.sh
    ./createPeerAdminCard.sh

https://www.skcript.com/svr/how-to-build-nodejs-application-for-your-hyperledger-composer-networks/
https://github.com/hyperledger-archives/composer/blob/master/packages/composer-cli/gen/transactiontemplate#L72


https://github.com/hyperledger-archives/composer-sample-applications/blob/master/packages/digitalproperty-app/lib/landRegistry.js



composer-rest-server -y YOUR_API_KEY
