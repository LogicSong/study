<!--
 * @Author: songyipeng
 * @Date: 2022-09-15 19:23:46
-->

# 抽象语法树 AST

## 什么是抽象语法树

抽象语法树是前端工程化中绕不开的一个名词，可以说它是将代码抽象成了一个对象来表示。通过 AST 可以实现很多转换。比如：

1. 如何将 ts 转化为 js
2. 如何将 sass/less 转化为 css
3. 如何将 ES6 转化为 ES5(babel)
4. 如何对 js 进行代码检查/格式(eslint/prettier)
5. 如何识别 React JSX(babel/react)
6. GraphQL、MDX、VUE SFC 等等

## 如何使用 AST

**三步走；**

1. Parse: Code -> AST
2. Transform: AST -> AST
3. Generate: AST -> Code

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-13/AST.37256a.webp)

## AST 长什么样？

```js
// Code
const a = 4

// AST
{
  "type": "Program",
  "start": 0,
  "end": 11,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 11,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 11,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 7,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 11,
            "value": 4,
            "raw": "4"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

## AST 的生成

将 Code 转化为 AST 称之为解析，该步骤有两个阶段：词法分析(lexical analysis)和语法分析(syntactic analysis)

### 词法分析

词法分析是将 code 转化为 token 流，维护一个关于 Token 的数组

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-12-13/Parse.050e33.webp)

```js
// Code
a = 3

// Token
[
  { type: { ... }, value: "a", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "=", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "3", start: 4, end: 5, loc: { ... } },
  ...
]
```

token 流的应用：

1. 代码检查，比如 eslint 中判断是否以分号结尾，即是判断是否含有分号的 token
2. 语法高亮，如 highlight/prism 使之代码高亮

### 语法分析

语法分析将 Token 流转化为结构化的 AST，方便操作

```js
{
  "type": "Program",
  "start": 0,
  "end": 5,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 0,
      "end": 5,
      "expression": {
        "type": "AssignmentExpression",
        "start": 0,
        "end": 5,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 0,
          "end": 1,
          "name": "a"
        },
        "right": {
          "type": "Literal",
          "start": 4,
          "end": 5,
          "value": 3,
          "raw": "3"
        }
      }
    }
  ],
  "sourceType": "module"
}
```

## 资料

- 在 [AST Explorer](https://astexplorer.net/)中列举了很多语言的解析器和转化器
- 一个最简编译器的实现[ the super tiny compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
