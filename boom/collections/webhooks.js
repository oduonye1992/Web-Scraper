WebHooks  = new Meteor.Collection('webhook');

WebHooks.allow({
    insert : function(userId, doc){
        return !!userId;
    }
});

WebHookSchema = new SimpleSchema({
    endpoint: {
        type: String,
        label: "Endpoint",
        max: 200
    },
    service: {
        type: String,
        label: "Service",
        autoform : {
            options: function() {
                var opts = Services.find().map(function(entity) {
                    return {
                        label: entity.name,
                        value: entity._id
                    };
                });
                return opts;
            }
        }
    },
    owner : {
        type : String,
        label : 'Owner',
        autoValue : function(){
            return this.userId;
        },
        autoform : {
            type : 'hidden'
        }
    },
    createdAt : {
        type : Date,
        label : 'Created At',
        autoValue : function(){
            return new Date()
        },
        autoform : {
            type : 'hidden'
        }
    }
});
WebHooks.attachSchema(WebHookSchema);

