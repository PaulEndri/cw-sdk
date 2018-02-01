export default class Conditions {
    toString() {
        let result = [];
        for(var key of Object.keys(this)) {
            if(typeof(this[key]) !== 'function') {
                result.push(key.replace(' ', '/') + `="${this[key]}"`);
            }
        }

        return result.join('%20and%20');
    }
}