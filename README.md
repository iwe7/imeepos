## imeepos
> lerna 多包管理

### 创建ng项目
> 存放目录 clients
```sh
ng new ng-demo
```
### nestjs项目
> 存放目录src

### 构建目录
> dist

> 基础类库 - 高共用，高使用，低更新 - chunk-libs
> 低频组件 - 低共用，低使用，低更新 - chunk-lazy

> ui组件库 - 高共用，高使用，中更新 - chunk-ui
> 必要组件/函数 - 高共用，高使用，中更新 - chunk-need
> 非必要组件/函数 - 高共用，高使用，中更新 - chunk-free

> 业务代码 - 低共用，高使用，高更新 - bundle
