function selectionSort(arr) {
    for(let i = arr.length - 1; i >= 0; i--) {
        let maxIndex = 0;
        for(let j = 0; j <= i; j++) {
            if (arr[j] > arr[maxIndex]) {
                maxIndex = j;
            }
        }
        swap(arr, maxIndex, i);
    }
    return arr;
}
function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
const arr = [2,7,1,5,3,9,10,9,8,0];
selectionSort(arr);
console.log(arr)