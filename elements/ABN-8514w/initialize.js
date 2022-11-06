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
        
        data.xano.get(data.endpoint,data.body).then(

            // Success

            function(res) {
                
                
                publish('status_code', res.getStatusCode());


                const body = res.getBody('_api_c2_');
                
                

                if (body._api_c2_items){

                    !data.returnDataType ? '' : publish('data',body._api_c2_items);
                    publish('page_current',body._api_c2_curPage);
                    publish('page_next',body._api_c2_nextPage);
                    publish('page_prev',body._api_c2_prevPage);
                    publish('page_total',body._api_c2_pageTotal);
                    publish('items_received',body._api_c2_itemsReceived);
                    publish('items_total',body._api_c2_itemsTotal);
                	publish('raw_json_body', JSON.stringify(res.getBody().items));

                } else {

                    !data.returnDataType ? '' : publish('data',body);
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
        
          if (document.visibilityState === 'visible' && xano.hasAuthToken()) {
          	           
              data.query();
              
          }
              
    });



}