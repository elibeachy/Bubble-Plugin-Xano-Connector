function(instance, properties, context) {
    
    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;
   
    // Post to the login endpoint
    
    xano.post('/auth/login',{
        
        'email': properties.email,
        'password': properties.password
        
    }).then(
        
        // Success
        
        function(res) {
            
            let body = res.getBody();
            // console.log(JSON.stringify(res));
            // console.log(body.authToken);
			xano.setAuthToken(body.authToken);    
            data.get_user(body.authToken);        
        },

        // Error
        
        function(error) {
            
            context.reportDebugger(error.message);
            
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