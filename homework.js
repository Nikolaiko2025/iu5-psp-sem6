// ==================== 1 УРОВЕНЬ ====================

// 1.3 Сумма квадратов массива
function sumOfSquares(arr) {
    return arr.reduce((sum, num) => sum + num * num, 0);
}

// 1.8 Среднее арифметическое
function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, num) => sum + num, 0) / arr.length;
}

// ==================== 2 УРОВЕНЬ ====================

// 2.9 Проверка возможности получения одного массива из другого
function isEquivalent(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    
    const count = {};
    for (const item of arr1) {
        count[item] = (count[item] || 0) + 1;
    }
    for (const item of arr2) {
        if (!count[item]) return false;
        count[item]--;
    }
    return true;
}

// ==================== 3 УРОВЕНЬ ====================

// 3.7 Flatten объекта в plain-объект
function plainify(obj, prefix = '') {
    const result = {};
    
    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        
        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, plainify(value, newKey));
        } else {
            result[newKey] = value;
        }
    }
    
    return result;
}

// ==================== ТЕСТЫ ====================

console.log('=== 1.3 sumOfSquares ===');
console.log(sumOfSquares([1, 2, 3])); // 14
console.log(sumOfSquares([2, 4, 5])); // 45

console.log('\n=== 1.8 average ===');
console.log(average([1, 2, 3, 4, 5])); // 3
console.log(average([10, 20, 30])); // 20

console.log('\n=== 2.9 isEquivalent ===');
console.log(isEquivalent([1, 2, 3, 8, -2], [2, 3, 8, 1, -2])); // true
console.log(isEquivalent([1, 2, 3], [1, 2])); // false
console.log(isEquivalent([1, 1, 2], [1, 2, 2])); // false

console.log('\n=== 3.7 plainify ===');
const nested = {
    a: {
        b: {
            c: 1
        },
        d: 2
    },
    e: 3
};
console.log(plainify(nested));
// { 'a.b.c': 1, 'a.d': 2, 'e': 3 }