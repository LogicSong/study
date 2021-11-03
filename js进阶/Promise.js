// Promise首先是一个构造函数
// 接受一个执行器函数excutor
// excutor: function (resolve, reject) {}
function myPromise(excutor) {
    // 状态:pengding,fulfilled,rejected
    this.state = 'pending';

    // 成功值
    this.value;
    // 失败原因
    this.reason;

    // 回调函数数组
    this.resolveFuncs = [];
    this.rejectFuncs = [];

    const resolve = value => {
        if (this.state === 'pending') {
            this.state = 'fulfilled';
            this.value = value;
        }
    }

    const reject = reason => {
        if (this.state === 'pending') {
            this.state = 'rejected';
            this.reason = reason;
        }
    }

    // 执行执行器函数
    // 因为执行器函数是用户传的，可能报错
    try {
        excutor(resolve, reject);
    } catch(e) {
        console.log('excutor error', e);
    }
}

// then 方法是promise的原型方法
// 接受一个成功回调f1和一个失败回调f2
// f1接收成功的返回值，f2接受失败的返回值
myPromise.prototype.then = function(f1, f2) {

}

Promise.prototype.all = function(arr) {
    return new Promise((resolve, reject) => {
        // 判断arr是否为数组
        if (!Array.isArray(arr)) {
            throw new Error('参数必须为数组');
        }
        // 设置计数器
        let count = 0;
        // 返回数组
        let dataArr = [];
        for (let i = 0; i < arr.length; i++) {
            const p = arr[i];
            p.then(data => {
                dataArr.push(data);
                count ++;
                if (count === arr.length - 1) {
                    resolve(dataArr);
                    return;
                }
            }).catch(reason => {
                reject(reason);
                return;
            })
        }
    })
}