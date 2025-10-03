export  function decodeString(x) {
    if(typeof x === 'string'){
        x = x.replace(/\+/g, '%20'); // 'Friday%20September%2013th'
        x = decodeURIComponent(x);
        return x;
    }
    return '';
}
