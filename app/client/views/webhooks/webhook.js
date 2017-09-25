import { Tracker } from 'meteor/tracker';
Template.webhook.events({
    'submit #webhook-form-add'(event) {
        event.preventDefault();
        WebHooks.insert({
            endpoint : event.target.endpoint.value
        })
    }
});

Template.webhook.helpers({
    services() {
        return Services.find();
    }
})

