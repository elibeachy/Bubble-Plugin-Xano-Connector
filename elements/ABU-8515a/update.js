function(instance, properties, context) {
    
    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;

    if (!data.xano) {

        data.init(properties.group_url);

    }

    // Check if endpoint starts with / and add one if it doesn't
    if (properties.endpoint[0] !== "/") {
        data.endpoint = `/${properties.endpoint}`
    } else {
        data.endpoint = properties.endpoint;
    }
    
    // Check if a record id exists and append to the endpoint
    if (!properties.record_id == false) {
        data.endpoint = `${data.endpoint}/${properties.record_id}`
    }
    
    data.returnDataType = !properties.data_type === false;
    
    if (properties.parameters) {
        
        data.params = JSON.parse(properties.parameters);
        
    } else {
        
        data.params = {}
        
    }
    
    
    data.get(data.endpoint, data.params);
        




}