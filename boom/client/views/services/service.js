Meteor.subscribe('services', function(){

});

Template.services.helpers({
    services : () => {
        return Services.find();
    }
});