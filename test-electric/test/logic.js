/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');

const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));

const namespace = 'test';
const assetType = 'Meter';
const assetNS = namespace + '.' + assetType;
const participantType = 'Customer';
const participantNS = namespace + '.' + participantType;

describe('#' + namespace, () => {
    // In-memory card store for testing so cards are not persisted to the file system
    const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore({ type: 'composer-wallet-inmemory' });

    // Embedded connection used for local testing
    const connectionProfile = {
        name: 'embedded',
        'x-type': 'embedded'
    };

    // Name of the business network card containing the administrative identity for the business network
    const adminCardName = 'admin@test-electric';

    // Admin connection to the blockchain, used to deploy the business network
    let adminConnection;

    // This is the business network connection the tests will use.
    let businessNetworkConnection;

    // This is the factory for creating instances of types.
    let factory;

    // These are the identities for Sultan and Bob.
    const sultanCardName = 'sultan';
    const utilityCardName = 'utility';

    // These are a list of receieved events.
    let events;

    let businessNetworkName;

    before(async () => {
        // Generate certificates for use with the embedded connection
        const credentials = CertificateUtil.generate({ commonName: 'admin' });

        // Identity used with the admin connection to deploy business networks
        const deployerMetadata = {
            version: 1,
            userName: 'PeerAdmin',
            roles: ['PeerAdmin', 'ChannelAdmin']
        };
        const deployerCard = new IdCard(deployerMetadata, connectionProfile);
        deployerCard.setCredentials(credentials);
        const deployerCardName = 'PeerAdmin';

        adminConnection = new AdminConnection({ cardStore: cardStore });

        await adminConnection.importCard(deployerCardName, deployerCard);
        await adminConnection.connect(deployerCardName);
    });

    /**
     *
     * @param {String} cardName The card name to use for this identity
     * @param {Object} identity The identity details
     */
    async function importCardForIdentity(cardName, identity) {
        const metadata = {
            userName: identity.userID,
            version: 1,
            enrollmentSecret: identity.userSecret,
            businessNetwork: businessNetworkName
        };
        const card = new IdCard(metadata, connectionProfile);
        await adminConnection.importCard(cardName, card);
    }

  
       beforeEach(async () => {
        businessNetworkConnection = new BusinessNetworkConnection();
        await businessNetworkConnection.connect(adminCardName);
        // Get the factory for the business network.
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    });


          /*
        // Generate a business network definition from the project directory.
        let businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(__dirname, '..'));
        businessNetworkName = businessNetworkDefinition.getName();
        await adminConnection.install(businessNetworkDefinition);
        const startOptions = {
            networkAdmins: [
                {
                    userName: 'admin',
                    enrollmentSecret: 'adminpw'
                }
            ]
        };
        const adminCards = await adminConnection.start(businessNetworkName, businessNetworkDefinition.getVersion(), startOptions);
        await adminConnection.importCard(adminCardName, adminCards.get('admin'));

        // Create and establish a business network connection
        //   businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
        businessNetworkConnection = new BusinessNetworkConnection();
        events = [];
        /*
        businessNetworkConnection.on('event', event => {
            events.push(event);
        });

        






    const IdentityIssue = require('composer-cli').Identity.Issue;

    let options = {
        card: 'admin@test-electric',
        file: sultanCardName,
        newUserId: 'sultan1234',
        participantId: participantNS + '#sultan@email.com'
    };

    IdentityIssue.handler(options);



    const CardImport = require('composer-cli').Card.Import;

    let options2 = {
        file: 'sultan.card',
        card: 'sultan@test-electric'
    };

    CardImport.handler(options2);
    // Issue the identities.
    //  let identity = await businessNetworkConnection.issueIdentity(participantNS + '#sultan@email.com', 'sultan1');
    //    await importCardForIdentity(sultanCardName, identity);
    // identity = await businessNetworkConnection.issueIdentity(participantNS + '#bob@email.com', 'bob1');
    // await importCardForIdentity(bobCardName, identity);




*/

// This is called before each test is executed.

/**
 * Reconnect using a different identity.
 * @param {String} cardName The name of the card for the identity to use
 */
async function useIdentity(cardName) {
    await businessNetworkConnection.disconnect();
    businessNetworkConnection = new BusinessNetworkConnection({ cardStore: cardStore });
    events = [];
    businessNetworkConnection.on('event', (event) => {
        events.push(event);
    });
    await businessNetworkConnection.connect(cardName);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
}

it('Admin Create IoT Meter with Id 16', async () => {
   
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    const meter = factory.newResource(namespace, assetType, '16');
    meter.owner = factory.newRelationship(namespace, participantType, 'sultan@email.com');
    meter.balance = 0;
    meter.houseNumber = "73"
    await assetRegistry.add(meter);

    const asset1 = await assetRegistry.get('11');

    asset1.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#sultan@email.com', 'Wrong owner');
    asset1.houseNumber.should.equal('73', "Test didnt pass the value is incorrect");

 

});

return;
it('Admin Creates Customer', async () => {
    
    //composer network reset -c admin@test-electric
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(participantNS);
    // Create the Customer resource. 
    const customer = factory.newResource(namespace, participantType, 'sultan8@email.com');
    // Add the data
    customer.firstName = 'Sultan';
    customer.lastName = 'Numyalai';
    customer.email = 'numyalai@gmail.com'
    customer.phoneNumber = "0940730163"
    customer.address = "abc"
    participantRegistry.add(customer);


    const customerId = await participantRegistry.resolve('sultan5@email.com')

    

    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(participantNS);
    const customerId = await participantRegistry.get('sultan@email.com')
    console.log(customerId.getIdentifier())
    // Use the identity for Alice.
    //await useIdentity(sultanCardName);
  //  const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    //const assets = await assetRegistry.getAll();
    
});

return;

it('Admin makes transaction ChangeOwner', async () => { 
});

it('Admin makes transaction MetereUpdate', async () => {
});
it('Admin creates Utility company', async () => {
});
it('Admin issues identity to Utility company', async () => {
 
});
it('Utility company can see stateses of the Meters', async () => { 
});
it('Sultan can read all of his assets transactions', async () => {
});
it('Sultan can read all of his assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    const assets = await assetRegistry.getAll();

    // Validate the assets.
    assets.should.have.lengthOf(2);
    const asset1 = assets[0];
    asset1.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#alice@email.com');
    asset1.value.should.equal('10');
    const asset2 = assets[1];
    asset2.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#bob@email.com');
    asset2.value.should.equal('20');
});

it('Alice can add assets that she owns', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Create the asset.
    let asset3 = factory.newResource(namespace, assetType, '3');
    asset3.owner = factory.newRelationship(namespace, participantType, 'alice@email.com');
    asset3.value = '30';

    // Add the asset, then get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    await assetRegistry.add(asset3);

    // Validate the asset.
    asset3 = await assetRegistry.get('3');
    asset3.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#alice@email.com');
    asset3.value.should.equal('30');
});

it('Alice cannot add assets that Bob owns', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Create the asset.
    const asset3 = factory.newResource(namespace, assetType, '3');
    asset3.owner = factory.newRelationship(namespace, participantType, 'bob@email.com');
    asset3.value = '30';

    // Try to add the asset, should fail.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    assetRegistry.add(asset3).should.be.rejectedWith(/does not have .* access to resource/);
});

it('Bob can add assets that he owns', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Create the asset.
    let asset4 = factory.newResource(namespace, assetType, '4');
    asset4.owner = factory.newRelationship(namespace, participantType, 'bob@email.com');
    asset4.value = '40';

    // Add the asset, then get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    await assetRegistry.add(asset4);

    // Validate the asset.
    asset4 = await assetRegistry.get('4');
    asset4.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#bob@email.com');
    asset4.value.should.equal('40');
});

it('Bob cannot add assets that Alice owns', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Create the asset.
    const asset4 = factory.newResource(namespace, assetType, '4');
    asset4.owner = factory.newRelationship(namespace, participantType, 'alice@email.com');
    asset4.value = '40';

    // Try to add the asset, should fail.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    assetRegistry.add(asset4).should.be.rejectedWith(/does not have .* access to resource/);

});

it('Alice can update her assets', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Create the asset.
    let asset1 = factory.newResource(namespace, assetType, '1');
    asset1.owner = factory.newRelationship(namespace, participantType, 'alice@email.com');
    asset1.value = '50';

    // Update the asset, then get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    await assetRegistry.update(asset1);

    // Validate the asset.
    asset1 = await assetRegistry.get('1');
    asset1.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#alice@email.com');
    asset1.value.should.equal('50');
});

it('Alice cannot update Bob\'s assets', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Create the asset.
    const asset2 = factory.newResource(namespace, assetType, '2');
    asset2.owner = factory.newRelationship(namespace, participantType, 'bob@email.com');
    asset2.value = '50';

    // Try to update the asset, should fail.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    assetRegistry.update(asset2).should.be.rejectedWith(/does not have .* access to resource/);
});

it('Bob can update his assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Create the asset.
    let asset2 = factory.newResource(namespace, assetType, '2');
    asset2.owner = factory.newRelationship(namespace, participantType, 'bob@email.com');
    asset2.value = '60';

    // Update the asset, then get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    await assetRegistry.update(asset2);

    // Validate the asset.
    asset2 = await assetRegistry.get('2');
    asset2.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#bob@email.com');
    asset2.value.should.equal('60');
});

it('Bob cannot update Alice\'s assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Create the asset.
    const asset1 = factory.newResource(namespace, assetType, '1');
    asset1.owner = factory.newRelationship(namespace, participantType, 'alice@email.com');
    asset1.value = '60';

    // Update the asset, then get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    assetRegistry.update(asset1).should.be.rejectedWith(/does not have .* access to resource/);

});

it('Alice can remove her assets', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Remove the asset, then test the asset exists.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    await assetRegistry.remove('1');
    const exists = await assetRegistry.exists('1');
    exists.should.be.false;
});

it('Alice cannot remove Bob\'s assets', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Remove the asset, then test the asset exists.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    assetRegistry.remove('2').should.be.rejectedWith(/does not have .* access to resource/);
});

it('Bob can remove his assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Remove the asset, then test the asset exists.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    await assetRegistry.remove('2');
    const exists = await assetRegistry.exists('2');
    exists.should.be.false;
});

it('Bob cannot remove Alice\'s assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Remove the asset, then test the asset exists.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    assetRegistry.remove('1').should.be.rejectedWith(/does not have .* access to resource/);
});

it('Alice can submit a transaction for her assets', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Submit the transaction.
    const transaction = factory.newTransaction(namespace, 'SampleTransaction');
    transaction.asset = factory.newRelationship(namespace, assetType, '1');
    transaction.newValue = '50';
    await businessNetworkConnection.submitTransaction(transaction);

    // Get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    const asset1 = await assetRegistry.get('1');

    // Validate the asset.
    asset1.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#alice@email.com');
    asset1.value.should.equal('50');

    // Validate the events.
    events.should.have.lengthOf(1);
    const event = events[0];
    event.eventId.should.be.a('string');
    event.timestamp.should.be.an.instanceOf(Date);
    event.asset.getFullyQualifiedIdentifier().should.equal(assetNS + '#1');
    event.oldValue.should.equal('10');
    event.newValue.should.equal('50');
});

it('Alice cannot submit a transaction for Bob\'s assets', async () => {
    // Use the identity for Alice.
    await useIdentity(aliceCardName);

    // Submit the transaction.
    const transaction = factory.newTransaction(namespace, 'SampleTransaction');
    transaction.asset = factory.newRelationship(namespace, assetType, '2');
    transaction.newValue = '50';
    businessNetworkConnection.submitTransaction(transaction).should.be.rejectedWith(/does not have .* access to resource/);
});

it('Bob can submit a transaction for his assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Submit the transaction.
    const transaction = factory.newTransaction(namespace, 'SampleTransaction');
    transaction.asset = factory.newRelationship(namespace, assetType, '2');
    transaction.newValue = '60';
    await businessNetworkConnection.submitTransaction(transaction);

    // Get the asset.
    const assetRegistry = await businessNetworkConnection.getAssetRegistry(assetNS);
    const asset2 = await assetRegistry.get('2');

    // Validate the asset.
    asset2.owner.getFullyQualifiedIdentifier().should.equal(participantNS + '#bob@email.com');
    asset2.value.should.equal('60');

    // Validate the events.
    events.should.have.lengthOf(1);
    const event = events[0];
    event.eventId.should.be.a('string');
    event.timestamp.should.be.an.instanceOf(Date);
    event.asset.getFullyQualifiedIdentifier().should.equal(assetNS + '#2');
    event.oldValue.should.equal('20');
    event.newValue.should.equal('60');
});

it('Bob cannot submit a transaction for Alice\'s assets', async () => {
    // Use the identity for Bob.
    await useIdentity(bobCardName);

    // Submit the transaction.
    const transaction = factory.newTransaction(namespace, 'SampleTransaction');
    transaction.asset = factory.newRelationship(namespace, assetType, '1');
    transaction.newValue = '60';
    businessNetworkConnection.submitTransaction(transaction).should.be.rejectedWith(/does not have .* access to resource/);
});

});
