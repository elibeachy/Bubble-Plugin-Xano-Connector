function(instance, context) {
    
    window.xano = new XanoClient({
                    'apiGroupBaseUrl': context.keys['Group URL'],
        			'dataSource': context.keys['data-source']
    });
    
    
    let data = instance.data,
        publish = instance.publishState,
        trigger = instance.triggerEvent;


    
    const i = instance,
          c = context;
    
        
    // console.log('xano is initializied')
    let user = JSON.parse(localStorage.getItem('xano_object'));
    

    
    data.xano_object = function(first,last,email) {
       return {
           nameFirst: first,
           nameLast: last,
           email: email
       }
    }
    
    
    data.log_out = function() {
        
        xano.setAuthToken(null);
        
        localStorage.setItem('xano_object','{}');
        publish('authToken','');
        publish('name_first','');
        publish('email','');
        publish('name_last','');
        publish('is_logged_in', false);
        
        trigger('is_logged_out')
        
        data.loggedIn = false;
       
    }
    
    window.xanoLogUserOut = data.log_out;
    
    data.set_user = function(user) {
        
        publish('authToken',localStorage.getItem('AuthToken'));
        publish('name_first',user.nameFirst);
        publish('name_last', user.nameLast)
        publish('email', user.email);
        publish('is_logged_in', !xano.hasAuthToken() == false);
        
        
        
        trigger('is_logged_in')
        
        data.loggedIn = !xano.hasAuthToken() == false;
        
        localStorage.setItem('xano_object', JSON.stringify(user));
    }
    
    data.get_user = function() {
        
            xano.get('/auth/me').then(
                // Success
                function(res) {
                    
                    const body = res.getBody('_api_')
                    
                    data.set_user(data.xano_object(res.body.name_first,res.body.name_last,res.body.email))
                },

                // Error
                function(error) {
                    
                    data.log_out();

                    var httpResponse = error.getResponse();
                }
            );

    }
     
    !user.authToken ? '': data.get_user();
    
    window.xanoGetUser = data.get_user;
    
    
        

    
	data.get_user(user.authToken);
    
    // console.log('Token ' + xano.hasAuthToken())
    
    
    document.addEventListener('visibilitychange', function () {
        
        // console.log('visbility change');
        // console.log(document.visibilityState);
        
          if (document.visibilityState === 'visible') {
              
              // console.log('get user');
              
              if (xano.hasAuthToken()) {
                  
                  data.get_user();
                  
              } else if(data.loggedIn == true) {
              
                  data.log_out();
                  
              }
          		
              
              
          }
              
    });
    
}