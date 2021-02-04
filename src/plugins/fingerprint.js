import Fingerprint2 from "fingerprintjs2"

let options = {}
const fingerprint = Fingerprint2.getPromise(options).then(function (components) {
    let values = components.map(function (component) {
        return component.value
    })
    return Fingerprint2.x64hash128(values.join(''), 31)
})

export default fingerprint