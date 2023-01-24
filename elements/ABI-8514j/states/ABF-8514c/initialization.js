function(properties, context) {

    try {

        let user = localStorage.getItem('AuthToken')

        return !user === false

    } catch(err) {

    }

}