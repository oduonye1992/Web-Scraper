Meteor.subscribe('webhook');
Meteor.subscribe('data');

Template.webhook.helpers({
    webhooks : () => {
        return WebHooks.find();
    }
});