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
        // 为了支持同步方法，需要延后，否则会因为方法还没传过来就调用而遗漏调用
        // 利用setTimeout特性将具体执行放到then之后
        setTimeout(() => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.resolveFuncs.forEach(func => {
                    func(value);
                })
            }
        })
    }

    const reject = reason => {
        // 为了支持同步方法，需要延后，否则会因为方法还没传过来就调用而遗漏调用
        // 利用setTimeout特性将具体执行放到then之后
        setTimeout(() => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.rejectFuncs.forEach(func => {
                    func(reason);
                })
            }
        })
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
// 接受一个成功回调onFulfilled和一个失败回调onRejected
// onFulfilled接收成功的返回值，onRejected接受失败的返回值
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    const self = this;
    let bridgePromise;
    //防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
    if (self.state === 'fulfilled') {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        })
    }
    if (self.state === 'rejected') {
        return bridgePromise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(self.error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    if (self.state === 'pending') {
        return bridgePromise = new MyPromise((resolve, reject) => {
            self.resolveFuncs.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.rejectFuncs.push((error) => {
                try {
                    let x = onRejected(error);
                    resolvePromise(bridgePromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
//catch方法其实是个语法糖，就是只传onRejected不传onFulfilled的then方法
MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}

//用来解析回调函数的返回值x，x可能是普通值也可能是个promise对象
function resolvePromise(bridgePromise, x, resolve, reject) {
    //如果x是一个promise
     if (x instanceof MyPromise) {
         //如果这个promise是pending状态，就在它的then方法里继续执行resolvePromise解析它的结果，直到返回值不是一个pending状态的promise为止
         if (x.status === PENDING) {
             x.then(y => {
                 resolvePromise(bridgePromise, y, resolve, reject);
             }, error => {
                 reject(error);
             });
         } else {
             x.then(resolve, reject);
         }
         //如果x是一个普通值，就让bridgePromise的状态fulfilled，并把这个值传递下去
     } else {
         resolve(x);
     }
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