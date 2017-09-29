Meteor.publish('webhook', function(){
    return WebHooks.find({owner : this.userId});
});

Meteor.publish('services', function(){
    return Services.find();
});

Meteor.publish('data', function(){
    return ScrapeData.find();
});
