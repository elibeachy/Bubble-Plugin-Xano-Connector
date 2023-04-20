function(instance, properties, context) {

    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent,
        endpoint = properties.endpoint,
        params = JSON.parse(properties.params);

    if (endpoint[0] !== "/") {

        endpoint = `/${endpoint}`
    }


    // console.log(properties.method)


    switch(properties.method) {
        case "PUT":
            data.put(endpoint, params)
            break;
        case "PATCH":
            data.patch(endpoint, params)
            break;
        case "GET":
            data.get(endpoint, params)
            break;
        case "HEAD":
            data.head(endpoint, params)
            break;
        case "DELETE":
            data.delete(endpoint, params)
            break;
        case "POST":
            data.post(endpoint, params)
            break;
        default:
   }





}