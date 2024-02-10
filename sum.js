function sum(a,b) {
    return a + b;
}

function multiply(a, b) {
  return a * b;
}



async function asyncMultiply(a, b) {
  return Promise.resolve(a * b);
}



function throwError() {
  throw new Error("Error thrown");
}




function getArray() {
  return [1, 2, 3];
}

module.exports = { sum, multiply, asyncMultiply, throwError, getArray };