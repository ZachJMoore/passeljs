function compareObject(a, b){
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

function isObject(obj){
    return obj === Object(obj);
}

module.exports = {
    compareObject,
    isObject
}