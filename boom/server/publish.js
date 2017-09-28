Meteor.publish('webhook', function(){
    return WebHooks.find({owner : this.userId});
});

Meteor.publish('services', function(){
    console.log("Publishing "+Services.find());
    return Services.find();
});
