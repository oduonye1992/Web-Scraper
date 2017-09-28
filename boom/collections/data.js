ScrapeData  = new Meteor.Collection('webhook');

ScrapeData.allow({
    insert : function(userId, doc){
        return true
    }
});

ScrapeDataSchema = new SimpleSchema({
    key: {
        type: String,
        label: "Key",
        max: 200
    },
    value: {
        type: String,
        label: "Value",
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

ScrapeData.attachSchema(ScrapeDataSchema);

