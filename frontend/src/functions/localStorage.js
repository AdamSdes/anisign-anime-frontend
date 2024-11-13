export default function localStorageReducer(originalReducer, localStorageKey){
    function wrapper(state, action) {
        if (state === undefined) {
          try {
            return JSON.parse(localStorage[localStorageKey])
        } 
        catch {}
        }

        const newState = originalReducer(state, action);
        localStorage[localStorageKey] = JSON.stringify(newState)

        return newState;
    }
    
    return wrapper;
}