import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Data = new Mongo.Collection('data');
Data.schema = new SimpleSchema({
    services: {
        type: String,
        label: "Name"
    },
    key: {
        type: String,
        label: "Key"
    },
    value: {
        type: String,
        label: "Value"
    }
});

Meteor.publish(null, function () {
    return Data.find();
});