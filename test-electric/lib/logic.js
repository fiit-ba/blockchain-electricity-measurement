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
 * Write your transction processor functions here
 */


 /**
  * Sample transaction
  * @param {test.MeterUpdate} meterUpdate
  * @transaction
  */


 async function meterUpdate(tx) 
 {
      const oldValue = tx.meter.balance;
      tx.meter.balance += tx.usage;
      
      const assetRegistry = await getAssetRegistry('test.Meter');
        
        // Update the asset in the asset registry.
        await assetRegistry.update(tx.meter);
        
        // Emit an event for the modified asset.
        let event = getFactory().newEvent('test', 'MeterUpdated');
        event.meter = tx.meter;
        event.oldValue = oldValue;
        event.newValue = tx.meter.balance;
        emit(event);

    }

