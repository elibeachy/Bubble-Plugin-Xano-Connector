function(properties, context) {

    try {

        return JSON.parse(localStorage.getItem('xano_object')).lastName;

    } catch(err) {

    }

}