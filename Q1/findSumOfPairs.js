function findSumOfPairs(arr){
    const list = new Set(arr)
    const output = new Set()

    for (let i=0; i<arr.length; i++){
        for(let j = i+1; j< arr.length; j++){
          const sum = arr[i] + arr[j];
          if(list.has(sum)){
            temp = [arr[i], arr[j], sum].sort()
            output.add(temp[0] + "," + temp[1] + "," + temp[2] )
          }
        }
    }
    return output
}

const arr = [ 2, 3, 11, 30, 3, 1, 4, 14, 27, 17, 5 ]
const sumOfPair = findSumOfPairs(arr)
console.log(sumOfPair);

