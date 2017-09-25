import { Tracker } from 'meteor/tracker';
Template.services.events({
    'submit #services-form-add'(event) {
        event.preventDefault();
        Services.insert({
            name : event.target.name.value,
            configuration : event.target.configuration.value
        })
    }
});



