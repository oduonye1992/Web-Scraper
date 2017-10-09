Services  = new Meteor.Collection('services');

Services.allow({
    insert : function(userId, doc){
        return !!userId;
    }
});

ServicesSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    configuration: {
        type: String,
        label: "Configuration"
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
Services.attachSchema(ServicesSchema);

