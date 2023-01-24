function(instance, properties, context) {

    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;

    if (!data.xano) {

        data.init(properties.group_url);

    }


}