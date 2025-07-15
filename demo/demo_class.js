function add(finalnumber){
    let total = 0;

    for (let i = 1; i <= finalnumber; i++) {
        total += i;
    }

    return total;
}
let ddd = add(7);
console.log("大傻子:", ddd);
