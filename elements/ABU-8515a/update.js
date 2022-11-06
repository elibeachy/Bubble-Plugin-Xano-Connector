function(instance, properties, context) {
    
    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;

    if (!data.xano) {

        data.init(properties.group_url);

    }

    data.endpoint = properties.endpoint;
    data.returnDataType = !properties.data_type === false;
    data.recordId = properties.record_id;
    
    if (!properties.record_id == false) {
        
        data.get(properties.endpoint, properties.record_id);
        
    } else {
        
        publish('data');
        publish('raw_json_body');
        
    }



}