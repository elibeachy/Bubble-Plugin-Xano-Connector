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


    data.query = function(){

        data.xano.get(data.endpoint,data.params).then(

            // Success

            function(res) {


                publish('status_code', res.getStatusCode());


                const body = res.getBody('_api_c2_');  

                const bodyNew = res.getBody();



                if (body._api_c2_items){

                    !data.returnDataType ? '' : publish('data',body._api_c2_items.map(x=>flattenObj(x)));
                    publish('page_current',body._api_c2_curPage);
                    publish('page_next',body._api_c2_nextPage);
                    publish('page_prev',body._api_c2_prevPage);
                    publish('page_total',body._api_c2_pageTotal);
                    publish('items_received',body._api_c2_itemsReceived);
                    publish('items_total',body._api_c2_itemsTotal);
                    publish('raw_json_body', JSON.stringify(res.getBody().items));

                } else {

                    !data.returnDataType ? '' : publish('data',body.map(x=>flattenObj(x)));
                    publish('raw_json_body', JSON.stringify(res.getBody()));

                }

                // reset error messages
                publish('error_message', null);
                publish('error_code', null);
            },

            // Error

            function(error) {

                var res = error.getResponse();

                let body = res.getBody();

                context.reportDebugger(body.message);

                publish('error_message', body.message);
                publish('error_code', body.code);
                publish('status_code', res.getStatusCode());
                trigger('threw_an_error');
            }
        );

    }

    document.addEventListener('visibilitychange', function () {

        // console.log('visbility change');
        // console.log(document.visibilityState);

        if (document.visibilityState === 'visible' && data.xano.hasAuthToken()) {

            data.query();

        }

    });

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