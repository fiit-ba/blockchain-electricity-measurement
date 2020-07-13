const CardImport = require('composer-cli').Card.Import;



async function importCard(cardName, userId) {


let options = {
  file: `cards/Customer${cardName}.card`,
  card: `${userId}@test-electric`
};
return CardImport.handler(options).then(function(identity){

}).catch(error => {

  throw error
})
}

module.exports = importCard;
