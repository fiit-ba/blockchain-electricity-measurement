const IdentityIssue = require('composer-cli').Identity.Issue;

async function issueIdentity(userId) {
  let options = {
    card: 'admin@test-electric',
    file:`cards/Customer${userId}`,
    newUserId:   `Customer${userId}ddd`,
    participantId:   `test.Customer#${userId}`
  };

    return IdentityIssue.handler(options).then(function(identity) { 
      return identity
    
    } ).catch(error => {throw error;}
    )
}

module.exports=issueIdentity;





