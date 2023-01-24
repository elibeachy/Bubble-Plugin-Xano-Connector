function(instance, context) {

    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;

    data.init = function(groupURL){

        let apiGroupBaseUrl;

        groupURL ? apiGroupBaseUrl = groupURL : apiGroupBaseUrl = context.keys['Group URL'];

        data.xano = new XanoClient({
            'apiGroupBaseUrl': apiGroupBaseUrl,
            'dataSource': context.keys['data-source']
        });

    }

    data.get = function(endpoint, params){

        data.xano.get(endpoint, params).then(
            // Success
            function(res) {

                console.log(res.getBody());

                let body = res.getBody('_api_c2_');
                
                publish('data', flattenObj(body));
                publish('raw_json_body',JSON.stringify(res.getBody()));
            },

            // Error
            function(error) {

                publish('data');
                publish('raw_json_body');

                var res = error.getResponse();

                let body = res.getBody();

                context.reportDebugger(body.message);

                publish('error_message', body.message);
                publish('error_code', body.code);
                publish('status_code', res.getStatusCode());
                trigger('threw_an_error');

            }
        )
    }

    // Flatten response to what Bubble is expectiing
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


}