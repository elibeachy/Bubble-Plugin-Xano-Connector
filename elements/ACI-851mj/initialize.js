function(instance, context) {

    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;


    data.init = function(groupURL) {

        let apiGroupBaseUrl;

        groupURL ? apiGroupBaseUrl = groupURL : apiGroupBaseUrl = context.keys['Group URL'];

        data.xano = new XanoClient({
            'apiGroupBaseUrl': apiGroupBaseUrl,
            'dataSource': context.keys['data-source']
        });

    }


    data.put = function(endpoint, params) {
        data.xano.put(endpoint, params).then(
            (response) => {
                let body = response.getBody('_api_c2_')
                processResponse(body, response.getStatusCode(), response.getBody());
            },
            (error) => {
                console.log('error')
                var res = error.getResponse();
                let body = res.getBody();
                processError(body,res.getStatusCode());
            }
        );

    }

    data.patch = function(endpoint, params) {
        data.xano.patch(endpoint, params).then(
            (response) => {
                let body = response.getBody('_api_c2_')
                processResponse(body, response.getStatusCode(), response.getBody());
            },
            (error) => {
                console.log('error')
                var res = error.getResponse();
                let body = res.getBody();
                processError(body,res.getStatusCode());
            }
        );

    }


    data.post = function(endpoint, params) {
        data.xano.post(endpoint, params).then(
            (response) => {
                let body = response.getBody('_api_c2_')
                processResponse(body, response.getStatusCode(), response.getBody());
            },
            (error) => {
                console.log('error')
                var res = error.getResponse();
                let body = res.getBody();
                processError(body,res.getStatusCode());
            }
        );

    }
    

    data.get = function(endpoint, params) {
        data.xano.get(endpoint, params).then(
            (response) => {
                let body = response.getBody('_api_c2_')
                processResponse(body, response.getStatusCode(), response.getBody());
            },
            (error) => {
                console.log('error')
                var res = error.getResponse();
                let body = res.getBody();
                processError(body,res.getStatusCode());
            }
        );

    }
    

    data.head = function(endpoint, params) {
        data.xano.head(endpoint, params).then(
            (response) => {
                let body = response.getBody('_api_c2_')
                processResponse(body, response.getStatusCode(), response.getBody());
            },
            (error) => {
                console.log('error')
                var res = error.getResponse();
                let body = res.getBody();
                processError(body,res.getStatusCode());
            }
        );

    }
    

    data.delete = function(endpoint, params) {
        data.xano.delete(endpoint, params).then(
            (response) => {
                let body = response.getBody('_api_c2_')
                processResponse(body, response.getStatusCode(), response.getBody());
            },
            (error) => {
                console.log('error')
                var res = error.getResponse();
                let body = res.getBody();
                processError(body,res.getStatusCode());
            }
        );

    }
    
    

    function flattenObj(data, parent = null) {
        // Create an empty object .
        let dataMap = {};
        // Loop over the data object that was given .
        for (const key in data) {
            // Set a key name by checking if parent was set by previous recursive calls .
            const keyName = parent ? parent + "." + key.replace("_api_c2_", "") : key;
            // Check the data type.
            if (typeof data[key] === "object" && !Array.isArray(data[key])) {
                // Using ES6 "Spread Operator" i overwrite the dataMap object with:
                // current dataMap + returned object result of the recurive call .
                dataMap = {
                    ...dataMap,
                    ...flattenObj(data[key], keyName)
                };
            } else if (typeof data[key] === "object" && Array.isArray(data[key])) {
                // Using ES6 "Spread Operator" i overwrite the dataMap object with:
                // current dataMap + returned object result of the recurive call .
                let array = [];
                data[key].map((x) => {
                    if (typeof x === "object") {
                        array.push(flattenObj(x));
                    } else {
                        array.push(x);
                    }
                });
                dataMap[keyName] = array;
            } else {
                // If data type is anything but an object append the "key: value" .
                dataMap[keyName] = data[key];
            }
        }
        return dataMap;
    }

    data.flattenObj = flattenObj;

    // Publish response data for all method types
    function processResponse(body, status, rawBody) {
        if (Array.isArray(body))  { // Process a returned array

            if (typeof body[0] == 'object') { // if array of objects

                publish("return_array", body.map(x=>{return flattenObj(x)}))

            } else { // if simple array

                publish("return_array", body)

            }

        } else { // Process a returned single value

            if (typeof body == 'object') { // if object value

                publish("return_thing", flattenObj(body))

            } else { // if simple value

                publish("return_thing", body)
            }

        }

        // Publish raw json value
        publish("raw_json_body", JSON.stringify(rawBody));

        // Trigger completion event
        trigger("postResult")
    }

    // Publish error data for all method types
    function processError(body, status) {
		console.log(body)
        context.reportDebugger(body.message);
        console.log(body.message)
        publish("return_array", null);
        publish("return_thing", null);
        
        publish("raw_json_body", null);
        publish('error_message', body.message);
        publish('error_code', body.code);
        publish('status_code', status);
        trigger('threw_an_error');
    }


}
