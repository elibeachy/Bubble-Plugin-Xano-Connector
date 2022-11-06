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

    data.get = function(endpoint,id){
        
        data.xano.get(endpoint + '/' + id,{}).then(
            // Success
            function(res) {

                const body = res.getBody('_api_c2_');

                context.reportDebugger(body);

                !data.returnDataType ? '' : publish('data',body);
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



}