FlowRouter.route('/', {
    name : "Webhook",
    action: function(params, queryParams) {
        if (Meteor.userId()){
            BlazeLayout.render("MainLayout", {main : 'webhook'});
        } else {
            BlazeLayout.render("MainLayout", {main : 'welcome'});
        }
    }
});
FlowRouter.route('/services', {
    name : "Services",
    action: function(params, queryParams) {
        if (Meteor.userId()){
            BlazeLayout.render("MainLayout", {main : 'services'});
        } else {
            BlazeLayout.render("MainLayout", {main : 'welcome'});
        }
    }
});
