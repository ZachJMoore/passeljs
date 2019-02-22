module.exports.compareObject = (a, b) => {
    return (
        (Object.keys(a).length === Object.keys(b).length)
    )
    &&
    (
        Object.keys(a).every(key=>{
            return a[key] === b[key]
        })
    )
}

module.exports.isObject = (obj) => {
    return obj === Object(obj);
}

module.exports.resolveObjectPath = (path, obj) => {
    if (Array.isArray(path)) path = path.join(".")
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

module.exports.createObjectPath = (path, obj) => {
    if (Array.isArray(path)) path = path.join(".")
    return path.split('.').reduce(function(prev, curr) {
        return prev[curr] = {}
    }, obj || self)
}