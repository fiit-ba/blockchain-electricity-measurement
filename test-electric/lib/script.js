'use strict';




/**
 * Sample transaction
 * @param {test.ChangeOwner} changeOwner
 * @transaction
 */


async function changeOwner(tx) {

  return getParticipantRegistry('test.Customer')
    .then(function (CustomerRegistry) {
      return CustomerRegistry.exists(tx.newOwner.getIdentifier())
    })
    .then(function (exists) {
      if (!exists) {
        throw Error('Invalid Customer id, Please Create Customer first')
      } else {
        return getAssetRegistry('test.Meter')
          .then(function (assetRegistry) {
            const oldOwner  = tx.meter.owner;
            tx.meter.owner = tx.newOwner;
            

            // Emit an event for the modified asset.
            let event = getFactory().newEvent('test', 'OwnerChanged');
            event.meter = tx.meter;
            event.oldOwner = oldOwner;
            event.newOwner = tx.meter.owner;
            emit(event);

            return assetRegistry.update(tx.meter);
          
          });
      }
    })
}


