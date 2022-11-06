function(instance, properties, context) {
    
    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;
    
    if (!data.xano) {
        
        data.init(properties.group_url);
        
    }
    
    data.endpoint = properties.endpoint;
    data.returnDataType = !properties.data_type === false;
    
    if (properties.body_json) {
        
        data.body = JSON.parse(properties.body_json);
        
    } else {
        
        data.body = {}
        
    }
    
    data.query()


}