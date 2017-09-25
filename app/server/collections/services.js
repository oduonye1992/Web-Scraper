/**
 * Created by daniel on 9/25/17.
 */
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Services = new Mongo.Collection('services');
Services.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
    },
    configuration: {
        type: String,
        label: "Configuration"
    }
});

Meteor.publish('services', function () {
    return Services.find();
});
