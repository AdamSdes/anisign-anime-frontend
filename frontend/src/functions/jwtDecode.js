export default function jwtDecode(token) { 
    try {
        const tokenSplit = token.split('.');
        const encodedPayload = tokenSplit[1];
        const decodedPayload = atob(encodedPayload);
        const decodedData = JSON.parse(decodedPayload);
        return decodedData;
    }
    catch(e) { 
        return undefined;
    }
}