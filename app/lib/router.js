FlowRouter.route('/', {
    action: function(params, queryParams) {
        if (Meteor.userId()){
            BlazeLayout.render("webhook");
        } else {
            BlazeLayout.render("welcome");
        }
    }
});

FlowRouter.route('/services', {
    action: function(params, queryParams) {
        if (Meteor.userId()){
            BlazeLayout.render("webhook");
        } else {
            BlazeLayout.render("services");
        }
    }
});
