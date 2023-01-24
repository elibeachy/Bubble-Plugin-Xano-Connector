function(properties, context) {

    try {

        return JSON.parse(localStorage.getItem('xano_object')).email;

    } catch(err) {

    }

}