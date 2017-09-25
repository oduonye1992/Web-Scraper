import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

var Schemas = {};
WebHooks = new Mongo.Collection("webhook");
Schemas.WebHooks = new SimpleSchema({
    endpoint: {
        type: String,
        label: "Endpoint",
        max: 200
    },
    service: {
        type: String,
        label: "Service"
    }
});

WebHooks.attachSchema(Schemas.WebHooks);


