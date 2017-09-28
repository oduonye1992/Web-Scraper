Meteor.subscribe('webhook');

Template.webhook.helpers({
    webhooks : () => {
        return WebHooks.find();
    }
});