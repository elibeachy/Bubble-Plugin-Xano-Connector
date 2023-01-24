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
    
    data.returnDataType = !properties.data_type === false;
    
    if (properties.parameters) {
        
        data.params = JSON.parse(properties.parameters);
        
    } else {
        
        data.params = {}
        
    }
    
    data.query()


}