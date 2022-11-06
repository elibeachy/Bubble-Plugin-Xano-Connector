function(properties, context) {
    
    let user = localStorage.getItem('AuthToken')
    
    return !user === false

}