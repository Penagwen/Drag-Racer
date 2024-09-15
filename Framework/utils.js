const getAngle = (x1, y1, x2, y2) => Math.atan2(y2-y1, x2-x1);

const getVelocity = (x1, y1, x2, y2) => {
    const angle = getAngle(x1, y1, x2, y2);
    return { x: Math.cos(angle), y: Math.sin(angle) }
}

function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
//convertRange( 328.17, [ 300.77, 559.22 ], [ 1, 10 ] );

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}