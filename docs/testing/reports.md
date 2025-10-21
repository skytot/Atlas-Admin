# 测试报告

## 📊 测试概览

| 指标 | 数值 | 状态 |
|------|------|------|
| 测试套件总数 | 36 | ✅ |
| 通过套件 | 36 | ✅ |
| 失败套件 | 0 | ✅ |
| 测试用例总数 | 132 | - |
| 通过用例 | 132 | ✅ |
| 失败用例 | 0 | ✅ |
| 成功率 | 100.0% | ✅ |
| 执行时间 | 0.43s | - |
| 开始时间 | 2025/10/21 15:14:45 | - |

## 🏗️ 模块分析


### http 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 1 |
| 测试用例数 | 10 |
| 通过用例 | 10 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.01s |

#### 测试文件详情


- **http-request.spec.ts**
  - 用例数: 10
  - 通过: 10 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s


#### 具体测试用例


1. **应当保持 axios 返回值形态（AxiosResponse）**
   - 状态: ✅ 通过
   - 耗时: 5.08ms
   - 分组: core/http/http-minimal
   

2. **toData 应当返回 data 部分**
   - 状态: ✅ 通过
   - 耗时: 1.38ms
   - 分组: core/http/http-minimal
   

3. **GET/POST/PUT/DELETE 应可调用并返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 1.23ms
   - 分组: core/http/http-minimal
   

4. **错误应保持为 AxiosError（由调用方自行断言/处理）**
   - 状态: ✅ 通过
   - 耗时: 2.13ms
   - 分组: core/http/http-minimal
   

5. **POST 请求应传递 body 并返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 0.84ms
   - 分组: core/http/http-minimal
   

6. **PUT 请求应传递 body 并返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 0.63ms
   - 分组: core/http/http-minimal
   

7. **DELETE 请求应返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 0.31ms
   - 分组: core/http/http-minimal
   

8. **请求错误应被原样抛出（AxiosError）**
   - 状态: ✅ 通过
   - 耗时: 0.57ms
   - 分组: core/http/http-minimal
   

9. **应当支持复杂请求配置（headers/params/timeout）**
   - 状态: ✅ 通过
   - 耗时: 0.79ms
   - 分组: core/http/http-minimal
   

10. **应当返回完整的 AxiosResponse（包含headers/status等）**
   - 状态: ✅ 通过
   - 耗时: 0.37ms
   - 分组: core/http/http-minimal
   


### error 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 1 |
| 测试用例数 | 4 |
| 通过用例 | 4 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.02s |

#### 测试文件详情


- **error-handler.spec.ts**
  - 用例数: 4
  - 通过: 4 ✅
  - 失败: 0 ✅
  - 耗时: 0.02s


#### 具体测试用例


1. **应当正确安装错误处理器**
   - 状态: ✅ 通过
   - 耗时: 2.55ms
   - 分组: core/error/error-handler
   

2. **应当捕获和处理 Vue 错误**
   - 状态: ✅ 通过
   - 耗时: 9.64ms
   - 分组: core/error/error-handler
   

3. **应当捕获未处理的 Promise 拒绝**
   - 状态: ✅ 通过
   - 耗时: 5.67ms
   - 分组: core/error/error-handler
   

4. **应当支持自定义错误级别**
   - 状态: ✅ 通过
   - 耗时: 2.83ms
   - 分组: core/error/error-handler
   


### router 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 3 |
| 测试用例数 | 29 |
| 通过用例 | 29 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.10s |

#### 测试文件详情


- **router-guard.spec.ts**
  - 用例数: 1
  - 通过: 1 ✅
  - 失败: 0 ✅
  - 耗时: 0.07s

- **router.spec.ts**
  - 用例数: 14
  - 通过: 14 ✅
  - 失败: 0 ✅
  - 耗时: 0.02s

- **static-routes.spec.ts**
  - 用例数: 14
  - 通过: 14 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s


#### 具体测试用例


1. **未登录访问受保护路由应跳转登录**
   - 状态: ✅ 通过
   - 耗时: 68.53ms
   - 分组: core/router/guard
   

2. **应当正确创建路由实例**
   - 状态: ✅ 通过
   - 耗时: 3.84ms
   - 分组: core/router/router
   

3. **应当使用HTML5 history模式**
   - 状态: ✅ 通过
   - 耗时: 0.84ms
   - 分组: core/router/router
   

4. **应当包含所有静态路由**
   - 状态: ✅ 通过
   - 耗时: 2.37ms
   - 分组: core/router/router
   

5. **应当正确配置登录路由**
   - 状态: ✅ 通过
   - 耗时: 0.77ms
   - 分组: core/router/router
   

6. **应当正确配置首页路由**
   - 状态: ✅ 通过
   - 耗时: 1.15ms
   - 分组: core/router/router
   

7. **应当正确解析路由**
   - 状态: ✅ 通过
   - 耗时: 0.59ms
   - 分组: core/router/router
   

8. **应当支持路由导航**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/router/router
   

9. **应当包含正确数量的路由**
   - 状态: ✅ 通过
   - 耗时: 1.20ms
   - 分组: core/router/router
   

10. **应当使用动态导入的组件**
   - 状态: ✅ 通过
   - 耗时: 0.92ms
   - 分组: core/router/router
   

11. **应当支持正确的路由结构**
   - 状态: ✅ 通过
   - 耗时: 0.48ms
   - 分组: core/router/router
   

12. **应当支持路由守卫**
   - 状态: ✅ 通过
   - 耗时: 0.48ms
   - 分组: core/router/router
   

13. **应当支持路由元信息**
   - 状态: ✅ 通过
   - 耗时: 0.49ms
   - 分组: core/router/router
   

14. **应当支持路由参数**
   - 状态: ✅ 通过
   - 耗时: 0.43ms
   - 分组: core/router/router
   

15. **应当支持查询参数**
   - 状态: ✅ 通过
   - 耗时: 1.54ms
   - 分组: core/router/router
   

16. **应当包含正确数量的路由**
   - 状态: ✅ 通过
   - 耗时: 3.38ms
   - 分组: core/router/static-routes
   

17. **应当包含登录路由**
   - 状态: ✅ 通过
   - 耗时: 0.64ms
   - 分组: core/router/static-routes
   

18. **应当包含首页路由**
   - 状态: ✅ 通过
   - 耗时: 0.45ms
   - 分组: core/router/static-routes
   

19. **应当正确配置登录路由组件**
   - 状态: ✅ 通过
   - 耗时: 0.21ms
   - 分组: core/router/static-routes
   

20. **应当正确配置首页路由组件**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/router/static-routes
   

21. **应当使用动态导入的组件**
   - 状态: ✅ 通过
   - 耗时: 0.28ms
   - 分组: core/router/static-routes
   

22. **应当包含必要的路由属性**
   - 状态: ✅ 通过
   - 耗时: 0.34ms
   - 分组: core/router/static-routes
   

23. **应当具有唯一的路由路径**
   - 状态: ✅ 通过
   - 耗时: 0.48ms
   - 分组: core/router/static-routes
   

24. **应当支持路由扩展**
   - 状态: ✅ 通过
   - 耗时: 1.43ms
   - 分组: core/router/static-routes
   

25. **应当支持路由守卫**
   - 状态: ✅ 通过
   - 耗时: 0.74ms
   - 分组: core/router/static-routes
   

26. **应当支持嵌套路由**
   - 状态: ✅ 通过
   - 耗时: 0.67ms
   - 分组: core/router/static-routes
   

27. **应当支持重定向**
   - 状态: ✅ 通过
   - 耗时: 0.54ms
   - 分组: core/router/static-routes
   

28. **应当支持路由别名**
   - 状态: ✅ 通过
   - 耗时: 1.32ms
   - 分组: core/router/static-routes
   

29. **应当支持路由名称**
   - 状态: ✅ 通过
   - 耗时: 1.00ms
   - 分组: core/router/static-routes
   


### auth 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 3 |
| 测试用例数 | 12 |
| 通过用例 | 12 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.05s |

#### 测试文件详情


- **auth-init.spec.ts**
  - 用例数: 4
  - 通过: 4 ✅
  - 失败: 0 ✅
  - 耗时: 0.02s

- **auth.spec.ts**
  - 用例数: 5
  - 通过: 5 ✅
  - 失败: 0 ✅
  - 耗时: 0.03s

- **persistence-simple.spec.ts**
  - 用例数: 3
  - 通过: 3 ✅
  - 失败: 0 ✅
  - 耗时: 0.00s


#### 具体测试用例


1. **应当正确恢复认证状态**
   - 状态: ✅ 通过
   - 耗时: 6.37ms
   - 分组: core/auth/init
   

2. **UserStore应当从认证模块恢复状态**
   - 状态: ✅ 通过
   - 耗时: 8.97ms
   - 分组: core/auth/init
   

3. **认证模块和UserStore状态应保持一致**
   - 状态: ✅ 通过
   - 耗时: 3.30ms
   - 分组: core/auth/init
   

4. **清除认证状态应同时清除UserStore状态**
   - 状态: ✅ 通过
   - 耗时: 2.47ms
   - 分组: core/auth/init
   

5. **应当正确设置和获取令牌**
   - 状态: ✅ 通过
   - 耗时: 4.93ms
   - 分组: core/auth
   

6. **应当正确清除令牌**
   - 状态: ✅ 通过
   - 耗时: 4.09ms
   - 分组: core/auth
   

7. **应当正确设置和获取用户信息**
   - 状态: ✅ 通过
   - 耗时: 4.68ms
   - 分组: core/auth
   

8. **应当返回正确的认证状态**
   - 状态: ✅ 通过
   - 耗时: 1.42ms
   - 分组: core/auth
   

9. **应当正确更新用户权限**
   - 状态: ✅ 通过
   - 耗时: 10.01ms
   - 分组: core/auth
   

10. **localStorage基本操作应正常工作**
   - 状态: ✅ 通过
   - 耗时: 1.22ms
   - 分组: core/auth/persistence (简化测试)
   

11. **应当正确清除数据**
   - 状态: ✅ 通过
   - 耗时: 0.28ms
   - 分组: core/auth/persistence (简化测试)
   

12. **加载不存在的数据应返回null**
   - 状态: ✅ 通过
   - 耗时: 0.09ms
   - 分组: core/auth/persistence (简化测试)
   


### storage 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 4 |
| 测试用例数 | 24 |
| 通过用例 | 24 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.04s |

#### 测试文件详情


- **json-like-string.spec.ts**
  - 用例数: 7
  - 通过: 7 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s

- **smart-serialization.spec.ts**
  - 用例数: 7
  - 通过: 7 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s

- **storage-manager.spec.ts**
  - 用例数: 7
  - 通过: 7 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s

- **storage-tools.spec.ts**
  - 用例数: 3
  - 通过: 3 ✅
  - 失败: 0 ✅
  - 耗时: 0.00s


#### 具体测试用例


1. **应当将 JSON-like 字符串作为原始字符串处理**
   - 状态: ✅ 通过
   - 耗时: 3.14ms
   - 分组: core/storage/json-like-string
   

2. **应当将真实 JSON 对象使用序列化格式处理**
   - 状态: ✅ 通过
   - 耗时: 1.72ms
   - 分组: core/storage/json-like-string
   

3. **应当正确区分 JSON-like 字符串和真实对象**
   - 状态: ✅ 通过
   - 耗时: 0.90ms
   - 分组: core/storage/json-like-string
   

4. **应当正确处理各种 JSON-like 字符串格式**
   - 状态: ✅ 通过
   - 耗时: 1.32ms
   - 分组: core/storage/json-like-string
   

5. **应当正确处理边界情况**
   - 状态: ✅ 通过
   - 耗时: 0.50ms
   - 分组: core/storage/json-like-string
   

6. **应当兼容旧数据格式**
   - 状态: ✅ 通过
   - 耗时: 0.19ms
   - 分组: core/storage/json-like-string
   

7. **应当正确处理混合数据类型**
   - 状态: ✅ 通过
   - 耗时: 0.85ms
   - 分组: core/storage/json-like-string
   

8. **应当智能识别字符串为原始数据**
   - 状态: ✅ 通过
   - 耗时: 3.78ms
   - 分组: core/storage/smart-serialization
   

9. **应当智能识别基本类型为原始数据**
   - 状态: ✅ 通过
   - 耗时: 0.95ms
   - 分组: core/storage/smart-serialization
   

10. **应当智能识别复杂类型为序列化数据**
   - 状态: ✅ 通过
   - 耗时: 2.25ms
   - 分组: core/storage/smart-serialization
   

11. **应当支持明确指定序列化选项**
   - 状态: ✅ 通过
   - 耗时: 1.19ms
   - 分组: core/storage/smart-serialization
   

12. **应当支持明确指定非序列化选项**
   - 状态: ✅ 通过
   - 耗时: 0.68ms
   - 分组: core/storage/smart-serialization
   

13. **应当向后兼容旧数据格式**
   - 状态: ✅ 通过
   - 耗时: 1.13ms
   - 分组: core/storage/smart-serialization
   

14. **应当正确处理混合数据类型**
   - 状态: ✅ 通过
   - 耗时: 1.53ms
   - 分组: core/storage/smart-serialization
   

15. **应当正确设置和获取存储项**
   - 状态: ✅ 通过
   - 耗时: 5.39ms
   - 分组: core/storage/storage-manager
   

16. **应当正确删除存储项**
   - 状态: ✅ 通过
   - 耗时: 1.72ms
   - 分组: core/storage/storage-manager
   

17. **应当正确清空所有存储项**
   - 状态: ✅ 通过
   - 耗时: 2.69ms
   - 分组: core/storage/storage-manager
   

18. **应当支持序列化控制**
   - 状态: ✅ 通过
   - 耗时: 0.72ms
   - 分组: core/storage/storage-manager
   

19. **应当支持默认值**
   - 状态: ✅ 通过
   - 耗时: 0.44ms
   - 分组: core/storage/storage-manager
   

20. **应当支持存储类型切换**
   - 状态: ✅ 通过
   - 耗时: 1.13ms
   - 分组: core/storage/storage-manager
   

21. **应当正确添加键名前缀**
   - 状态: ✅ 通过
   - 耗时: 0.33ms
   - 分组: core/storage/storage-manager
   

22. **toJSON/fromJSON 应该安全序列化与解析**
   - 状态: ✅ 通过
   - 耗时: 2.03ms
   - 分组: core/storage/tools
   

23. **withPrefix 应生成带前缀键名**
   - 状态: ✅ 通过
   - 耗时: 0.24ms
   - 分组: core/storage/tools
   

24. **withTTL 应包装值与过期时间**
   - 状态: ✅ 通过
   - 耗时: 0.44ms
   - 分组: core/storage/tools
   


### logger 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 4 |
| 测试用例数 | 38 |
| 通过用例 | 38 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.06s |

#### 测试文件详情


- **console-transport.spec.ts**
  - 用例数: 12
  - 通过: 12 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s

- **error-transport.spec.ts**
  - 用例数: 9
  - 通过: 9 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s

- **logger-tools.spec.ts**
  - 用例数: 2
  - 通过: 2 ✅
  - 失败: 0 ✅
  - 耗时: 0.01s

- **logger.spec.ts**
  - 用例数: 15
  - 通过: 15 ✅
  - 失败: 0 ✅
  - 耗时: 0.03s


#### 具体测试用例


1. **应当使用console.info输出debug日志**
   - 状态: ✅ 通过
   - 耗时: 4.41ms
   - 分组: core/logger/console-transport
   

2. **应当使用console.info输出info日志**
   - 状态: ✅ 通过
   - 耗时: 0.71ms
   - 分组: core/logger/console-transport
   

3. **应当使用console.warn输出warn日志**
   - 状态: ✅ 通过
   - 耗时: 0.66ms
   - 分组: core/logger/console-transport
   

4. **应当使用console.error输出error日志**
   - 状态: ✅ 通过
   - 耗时: 0.77ms
   - 分组: core/logger/console-transport
   

5. **应当正确格式化时间戳**
   - 状态: ✅ 通过
   - 耗时: 0.43ms
   - 分组: core/logger/console-transport
   

6. **应当正确格式化参数**
   - 状态: ✅ 通过
   - 耗时: 0.95ms
   - 分组: core/logger/console-transport
   

7. **应当正确格式化上下文**
   - 状态: ✅ 通过
   - 耗时: 0.46ms
   - 分组: core/logger/console-transport
   

8. **应当正确格式化标签**
   - 状态: ✅ 通过
   - 耗时: 0.43ms
   - 分组: core/logger/console-transport
   

9. **应当正确处理完整日志载荷**
   - 状态: ✅ 通过
   - 耗时: 0.57ms
   - 分组: core/logger/console-transport
   

10. **应当正确处理空参数**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/logger/console-transport
   

11. **应当正确处理空数组参数**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/logger/console-transport
   

12. **应当正确处理空对象上下文**
   - 状态: ✅ 通过
   - 耗时: 0.25ms
   - 分组: core/logger/console-transport
   

13. **应当上报error级别日志**
   - 状态: ✅ 通过
   - 耗时: 4.00ms
   - 分组: core/logger/error-transport
   

14. **应当忽略非error级别日志**
   - 状态: ✅ 通过
   - 耗时: 0.69ms
   - 分组: core/logger/error-transport
   

15. **应当处理无参数的error日志**
   - 状态: ✅ 通过
   - 耗时: 0.87ms
   - 分组: core/logger/error-transport
   

16. **应当处理只有args的error日志**
   - 状态: ✅ 通过
   - 耗时: 1.64ms
   - 分组: core/logger/error-transport
   

17. **应当处理只有context的error日志**
   - 状态: ✅ 通过
   - 耗时: 1.09ms
   - 分组: core/logger/error-transport
   

18. **应当处理复杂error日志**
   - 状态: ✅ 通过
   - 耗时: 0.83ms
   - 分组: core/logger/error-transport
   

19. **应当处理空数组和空对象**
   - 状态: ✅ 通过
   - 耗时: 0.31ms
   - 分组: core/logger/error-transport
   

20. **应当正确处理异步操作**
   - 状态: ✅ 通过
   - 耗时: 0.35ms
   - 分组: core/logger/error-transport
   

21. **应当正确处理reportError异常**
   - 状态: ✅ 通过
   - 耗时: 1.35ms
   - 分组: core/logger/error-transport
   

22. **withContext 应正确合并上下文与 extra**
   - 状态: ✅ 通过
   - 耗时: 1.73ms
   - 分组: core/logger/tools
   

23. **toErrorContext 应从错误中提取可用信息**
   - 状态: ✅ 通过
   - 耗时: 7.44ms
   - 分组: core/logger/tools
   

24. **应当输出debug级别日志**
   - 状态: ✅ 通过
   - 耗时: 8.15ms
   - 分组: core/logger/logger
   

25. **应当输出info级别日志**
   - 状态: ✅ 通过
   - 耗时: 1.48ms
   - 分组: core/logger/logger
   

26. **应当输出warn级别日志**
   - 状态: ✅ 通过
   - 耗时: 1.21ms
   - 分组: core/logger/logger
   

27. **应当输出error级别日志**
   - 状态: ✅ 通过
   - 耗时: 1.40ms
   - 分组: core/logger/logger
   

28. **应当正确过滤低级别日志**
   - 状态: ✅ 通过
   - 耗时: 0.74ms
   - 分组: core/logger/logger
   

29. **应当输出高级别日志**
   - 状态: ✅ 通过
   - 耗时: 0.80ms
   - 分组: core/logger/logger
   

30. **应当支持禁用日志**
   - 状态: ✅ 通过
   - 耗时: 0.47ms
   - 分组: core/logger/logger
   

31. **应当支持启用日志**
   - 状态: ✅ 通过
   - 耗时: 0.96ms
   - 分组: core/logger/logger
   

32. **应当正确合并上下文**
   - 状态: ✅ 通过
   - 耗时: 1.37ms
   - 分组: core/logger/logger
   

33. **应当正确处理标签**
   - 状态: ✅ 通过
   - 耗时: 1.12ms
   - 分组: core/logger/logger
   

34. **应当支持传输器管理**
   - 状态: ✅ 通过
   - 耗时: 0.82ms
   - 分组: core/logger/logger
   

35. **应当生成正确的时间戳**
   - 状态: ✅ 通过
   - 耗时: 4.65ms
   - 分组: core/logger/logger
   

36. **应当处理复杂上下文**
   - 状态: ✅ 通过
   - 耗时: 2.09ms
   - 分组: core/logger/logger
   

37. **应当处理无参数日志**
   - 状态: ✅ 通过
   - 耗时: 0.92ms
   - 分组: core/logger/logger
   

38. **应当支持所有日志级别**
   - 状态: ✅ 通过
   - 耗时: 2.16ms
   - 分组: core/logger/logger
   


### store 模块

| 指标 | 数值 |
|------|------|
| 测试文件数 | 2 |
| 测试用例数 | 15 |
| 通过用例 | 15 |
| 失败用例 | 0 |
| 成功率 | 100.0% |
| 执行时间 | 0.15s |

#### 测试文件详情


- **useAuth.spec.ts**
  - 用例数: 6
  - 通过: 6 ✅
  - 失败: 0 ✅
  - 耗时: 0.10s

- **user.store.spec.ts**
  - 用例数: 9
  - 通过: 9 ✅
  - 失败: 0 ✅
  - 耗时: 0.05s


#### 具体测试用例


1. **应当提供正确的认证功能**
   - 状态: ✅ 通过
   - 耗时: 71.48ms
   - 分组: core/store/modules/user/useAuth
   

2. **应当提供只读认证状态**
   - 状态: ✅ 通过
   - 耗时: 5.74ms
   - 分组: core/store/modules/user/useAuth
   

3. **应当正确同步认证状态**
   - 状态: ✅ 通过
   - 耗时: 8.79ms
   - 分组: core/store/modules/user/useAuth
   

4. **应当正确检查权限**
   - 状态: ✅ 通过
   - 耗时: 4.95ms
   - 分组: core/store/modules/user/useAuth
   

5. **应当正确处理认证操作**
   - 状态: ✅ 通过
   - 耗时: 4.95ms
   - 分组: core/store/modules/user/useAuth
   

6. **应当正确管理生命周期**
   - 状态: ✅ 通过
   - 耗时: 4.46ms
   - 分组: core/store/modules/user/useAuth
   

7. **应当具有正确的初始状态**
   - 状态: ✅ 通过
   - 耗时: 22.25ms
   - 分组: core/store/modules/user/user.store
   

8. **应当从认证模块同步状态**
   - 状态: ✅ 通过
   - 耗时: 13.37ms
   - 分组: core/store/modules/user/user.store
   

9. **getters 应正确反映状态**
   - 状态: ✅ 通过
   - 耗时: 3.54ms
   - 分组: core/store/modules/user/user.store
   

10. **应当提供正确的用户信息摘要**
   - 状态: ✅ 通过
   - 耗时: 2.39ms
   - 分组: core/store/modules/user/user.store
   

11. **应当正确管理状态**
   - 状态: ✅ 通过
   - 耗时: 1.57ms
   - 分组: core/store/modules/user/user.store
   

12. **应当正确启动认证同步**
   - 状态: ✅ 通过
   - 耗时: 3.79ms
   - 分组: core/store/modules/user/user.store
   

13. **应当正确刷新状态**
   - 状态: ✅ 通过
   - 耗时: 2.89ms
   - 分组: core/store/modules/user/user.store
   

14. **应当正确处理无用户状态**
   - 状态: ✅ 通过
   - 耗时: 1.23ms
   - 分组: core/store/modules/user/user.store
   

15. **应当正确处理权限检查边界情况**
   - 状态: ✅ 通过
   - 耗时: 1.18ms
   - 分组: core/store/modules/user/user.store
   



## ⏱️ 性能分析

### 最慢的测试用例 (前10个)


1. **应当提供正确的认证功能**
   - 耗时: 71.48ms
   - 文件: useAuth.spec.ts
   - 模块: store

2. **未登录访问受保护路由应跳转登录**
   - 耗时: 68.53ms
   - 文件: router-guard.spec.ts
   - 模块: router


## 📁 测试文件详情


### http-request.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/http/http-request.spec.ts`
- **模块**: http
- **状态**: ✅ 通过
- **测试用例**: 10 个
- **通过**: 10 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当保持 axios 返回值形态（AxiosResponse）**
   - 状态: ✅ 通过
   - 耗时: 5.08ms
   - 分组: core/http/http-minimal
   

2. **toData 应当返回 data 部分**
   - 状态: ✅ 通过
   - 耗时: 1.38ms
   - 分组: core/http/http-minimal
   

3. **GET/POST/PUT/DELETE 应可调用并返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 1.23ms
   - 分组: core/http/http-minimal
   

4. **错误应保持为 AxiosError（由调用方自行断言/处理）**
   - 状态: ✅ 通过
   - 耗时: 2.13ms
   - 分组: core/http/http-minimal
   

5. **POST 请求应传递 body 并返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 0.84ms
   - 分组: core/http/http-minimal
   

6. **PUT 请求应传递 body 并返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 0.63ms
   - 分组: core/http/http-minimal
   

7. **DELETE 请求应返回 AxiosResponse**
   - 状态: ✅ 通过
   - 耗时: 0.31ms
   - 分组: core/http/http-minimal
   

8. **请求错误应被原样抛出（AxiosError）**
   - 状态: ✅ 通过
   - 耗时: 0.57ms
   - 分组: core/http/http-minimal
   

9. **应当支持复杂请求配置（headers/params/timeout）**
   - 状态: ✅ 通过
   - 耗时: 0.79ms
   - 分组: core/http/http-minimal
   

10. **应当返回完整的 AxiosResponse（包含headers/status等）**
   - 状态: ✅ 通过
   - 耗时: 0.37ms
   - 分组: core/http/http-minimal
   


### error-handler.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/error/error-handler.spec.ts`
- **模块**: error
- **状态**: ✅ 通过
- **测试用例**: 4 个
- **通过**: 4 个
- **失败**: 0 个
- **耗时**: 0.02s

#### 测试用例列表


1. **应当正确安装错误处理器**
   - 状态: ✅ 通过
   - 耗时: 2.55ms
   - 分组: core/error/error-handler
   

2. **应当捕获和处理 Vue 错误**
   - 状态: ✅ 通过
   - 耗时: 9.64ms
   - 分组: core/error/error-handler
   

3. **应当捕获未处理的 Promise 拒绝**
   - 状态: ✅ 通过
   - 耗时: 5.67ms
   - 分组: core/error/error-handler
   

4. **应当支持自定义错误级别**
   - 状态: ✅ 通过
   - 耗时: 2.83ms
   - 分组: core/error/error-handler
   


### router-guard.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/router/router-guard.spec.ts`
- **模块**: router
- **状态**: ✅ 通过
- **测试用例**: 1 个
- **通过**: 1 个
- **失败**: 0 个
- **耗时**: 0.07s

#### 测试用例列表


1. **未登录访问受保护路由应跳转登录**
   - 状态: ✅ 通过
   - 耗时: 68.53ms
   - 分组: core/router/guard
   


### router.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/router/router.spec.ts`
- **模块**: router
- **状态**: ✅ 通过
- **测试用例**: 14 个
- **通过**: 14 个
- **失败**: 0 个
- **耗时**: 0.02s

#### 测试用例列表


1. **应当正确创建路由实例**
   - 状态: ✅ 通过
   - 耗时: 3.84ms
   - 分组: core/router/router
   

2. **应当使用HTML5 history模式**
   - 状态: ✅ 通过
   - 耗时: 0.84ms
   - 分组: core/router/router
   

3. **应当包含所有静态路由**
   - 状态: ✅ 通过
   - 耗时: 2.37ms
   - 分组: core/router/router
   

4. **应当正确配置登录路由**
   - 状态: ✅ 通过
   - 耗时: 0.77ms
   - 分组: core/router/router
   

5. **应当正确配置首页路由**
   - 状态: ✅ 通过
   - 耗时: 1.15ms
   - 分组: core/router/router
   

6. **应当正确解析路由**
   - 状态: ✅ 通过
   - 耗时: 0.59ms
   - 分组: core/router/router
   

7. **应当支持路由导航**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/router/router
   

8. **应当包含正确数量的路由**
   - 状态: ✅ 通过
   - 耗时: 1.20ms
   - 分组: core/router/router
   

9. **应当使用动态导入的组件**
   - 状态: ✅ 通过
   - 耗时: 0.92ms
   - 分组: core/router/router
   

10. **应当支持正确的路由结构**
   - 状态: ✅ 通过
   - 耗时: 0.48ms
   - 分组: core/router/router
   

11. **应当支持路由守卫**
   - 状态: ✅ 通过
   - 耗时: 0.48ms
   - 分组: core/router/router
   

12. **应当支持路由元信息**
   - 状态: ✅ 通过
   - 耗时: 0.49ms
   - 分组: core/router/router
   

13. **应当支持路由参数**
   - 状态: ✅ 通过
   - 耗时: 0.43ms
   - 分组: core/router/router
   

14. **应当支持查询参数**
   - 状态: ✅ 通过
   - 耗时: 1.54ms
   - 分组: core/router/router
   


### static-routes.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/router/static-routes.spec.ts`
- **模块**: router
- **状态**: ✅ 通过
- **测试用例**: 14 个
- **通过**: 14 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当包含正确数量的路由**
   - 状态: ✅ 通过
   - 耗时: 3.38ms
   - 分组: core/router/static-routes
   

2. **应当包含登录路由**
   - 状态: ✅ 通过
   - 耗时: 0.64ms
   - 分组: core/router/static-routes
   

3. **应当包含首页路由**
   - 状态: ✅ 通过
   - 耗时: 0.45ms
   - 分组: core/router/static-routes
   

4. **应当正确配置登录路由组件**
   - 状态: ✅ 通过
   - 耗时: 0.21ms
   - 分组: core/router/static-routes
   

5. **应当正确配置首页路由组件**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/router/static-routes
   

6. **应当使用动态导入的组件**
   - 状态: ✅ 通过
   - 耗时: 0.28ms
   - 分组: core/router/static-routes
   

7. **应当包含必要的路由属性**
   - 状态: ✅ 通过
   - 耗时: 0.34ms
   - 分组: core/router/static-routes
   

8. **应当具有唯一的路由路径**
   - 状态: ✅ 通过
   - 耗时: 0.48ms
   - 分组: core/router/static-routes
   

9. **应当支持路由扩展**
   - 状态: ✅ 通过
   - 耗时: 1.43ms
   - 分组: core/router/static-routes
   

10. **应当支持路由守卫**
   - 状态: ✅ 通过
   - 耗时: 0.74ms
   - 分组: core/router/static-routes
   

11. **应当支持嵌套路由**
   - 状态: ✅ 通过
   - 耗时: 0.67ms
   - 分组: core/router/static-routes
   

12. **应当支持重定向**
   - 状态: ✅ 通过
   - 耗时: 0.54ms
   - 分组: core/router/static-routes
   

13. **应当支持路由别名**
   - 状态: ✅ 通过
   - 耗时: 1.32ms
   - 分组: core/router/static-routes
   

14. **应当支持路由名称**
   - 状态: ✅ 通过
   - 耗时: 1.00ms
   - 分组: core/router/static-routes
   


### auth-init.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/auth/auth-init.spec.ts`
- **模块**: auth
- **状态**: ✅ 通过
- **测试用例**: 4 个
- **通过**: 4 个
- **失败**: 0 个
- **耗时**: 0.02s

#### 测试用例列表


1. **应当正确恢复认证状态**
   - 状态: ✅ 通过
   - 耗时: 6.37ms
   - 分组: core/auth/init
   

2. **UserStore应当从认证模块恢复状态**
   - 状态: ✅ 通过
   - 耗时: 8.97ms
   - 分组: core/auth/init
   

3. **认证模块和UserStore状态应保持一致**
   - 状态: ✅ 通过
   - 耗时: 3.30ms
   - 分组: core/auth/init
   

4. **清除认证状态应同时清除UserStore状态**
   - 状态: ✅ 通过
   - 耗时: 2.47ms
   - 分组: core/auth/init
   


### auth.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/auth/auth.spec.ts`
- **模块**: auth
- **状态**: ✅ 通过
- **测试用例**: 5 个
- **通过**: 5 个
- **失败**: 0 个
- **耗时**: 0.03s

#### 测试用例列表


1. **应当正确设置和获取令牌**
   - 状态: ✅ 通过
   - 耗时: 4.93ms
   - 分组: core/auth
   

2. **应当正确清除令牌**
   - 状态: ✅ 通过
   - 耗时: 4.09ms
   - 分组: core/auth
   

3. **应当正确设置和获取用户信息**
   - 状态: ✅ 通过
   - 耗时: 4.68ms
   - 分组: core/auth
   

4. **应当返回正确的认证状态**
   - 状态: ✅ 通过
   - 耗时: 1.42ms
   - 分组: core/auth
   

5. **应当正确更新用户权限**
   - 状态: ✅ 通过
   - 耗时: 10.01ms
   - 分组: core/auth
   


### persistence-simple.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/auth/persistence-simple.spec.ts`
- **模块**: auth
- **状态**: ✅ 通过
- **测试用例**: 3 个
- **通过**: 3 个
- **失败**: 0 个
- **耗时**: 0.00s

#### 测试用例列表


1. **localStorage基本操作应正常工作**
   - 状态: ✅ 通过
   - 耗时: 1.22ms
   - 分组: core/auth/persistence (简化测试)
   

2. **应当正确清除数据**
   - 状态: ✅ 通过
   - 耗时: 0.28ms
   - 分组: core/auth/persistence (简化测试)
   

3. **加载不存在的数据应返回null**
   - 状态: ✅ 通过
   - 耗时: 0.09ms
   - 分组: core/auth/persistence (简化测试)
   


### json-like-string.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/storage/json-like-string.spec.ts`
- **模块**: storage
- **状态**: ✅ 通过
- **测试用例**: 7 个
- **通过**: 7 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当将 JSON-like 字符串作为原始字符串处理**
   - 状态: ✅ 通过
   - 耗时: 3.14ms
   - 分组: core/storage/json-like-string
   

2. **应当将真实 JSON 对象使用序列化格式处理**
   - 状态: ✅ 通过
   - 耗时: 1.72ms
   - 分组: core/storage/json-like-string
   

3. **应当正确区分 JSON-like 字符串和真实对象**
   - 状态: ✅ 通过
   - 耗时: 0.90ms
   - 分组: core/storage/json-like-string
   

4. **应当正确处理各种 JSON-like 字符串格式**
   - 状态: ✅ 通过
   - 耗时: 1.32ms
   - 分组: core/storage/json-like-string
   

5. **应当正确处理边界情况**
   - 状态: ✅ 通过
   - 耗时: 0.50ms
   - 分组: core/storage/json-like-string
   

6. **应当兼容旧数据格式**
   - 状态: ✅ 通过
   - 耗时: 0.19ms
   - 分组: core/storage/json-like-string
   

7. **应当正确处理混合数据类型**
   - 状态: ✅ 通过
   - 耗时: 0.85ms
   - 分组: core/storage/json-like-string
   


### smart-serialization.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/storage/smart-serialization.spec.ts`
- **模块**: storage
- **状态**: ✅ 通过
- **测试用例**: 7 个
- **通过**: 7 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当智能识别字符串为原始数据**
   - 状态: ✅ 通过
   - 耗时: 3.78ms
   - 分组: core/storage/smart-serialization
   

2. **应当智能识别基本类型为原始数据**
   - 状态: ✅ 通过
   - 耗时: 0.95ms
   - 分组: core/storage/smart-serialization
   

3. **应当智能识别复杂类型为序列化数据**
   - 状态: ✅ 通过
   - 耗时: 2.25ms
   - 分组: core/storage/smart-serialization
   

4. **应当支持明确指定序列化选项**
   - 状态: ✅ 通过
   - 耗时: 1.19ms
   - 分组: core/storage/smart-serialization
   

5. **应当支持明确指定非序列化选项**
   - 状态: ✅ 通过
   - 耗时: 0.68ms
   - 分组: core/storage/smart-serialization
   

6. **应当向后兼容旧数据格式**
   - 状态: ✅ 通过
   - 耗时: 1.13ms
   - 分组: core/storage/smart-serialization
   

7. **应当正确处理混合数据类型**
   - 状态: ✅ 通过
   - 耗时: 1.53ms
   - 分组: core/storage/smart-serialization
   


### storage-manager.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/storage/storage-manager.spec.ts`
- **模块**: storage
- **状态**: ✅ 通过
- **测试用例**: 7 个
- **通过**: 7 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当正确设置和获取存储项**
   - 状态: ✅ 通过
   - 耗时: 5.39ms
   - 分组: core/storage/storage-manager
   

2. **应当正确删除存储项**
   - 状态: ✅ 通过
   - 耗时: 1.72ms
   - 分组: core/storage/storage-manager
   

3. **应当正确清空所有存储项**
   - 状态: ✅ 通过
   - 耗时: 2.69ms
   - 分组: core/storage/storage-manager
   

4. **应当支持序列化控制**
   - 状态: ✅ 通过
   - 耗时: 0.72ms
   - 分组: core/storage/storage-manager
   

5. **应当支持默认值**
   - 状态: ✅ 通过
   - 耗时: 0.44ms
   - 分组: core/storage/storage-manager
   

6. **应当支持存储类型切换**
   - 状态: ✅ 通过
   - 耗时: 1.13ms
   - 分组: core/storage/storage-manager
   

7. **应当正确添加键名前缀**
   - 状态: ✅ 通过
   - 耗时: 0.33ms
   - 分组: core/storage/storage-manager
   


### storage-tools.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/storage/storage-tools.spec.ts`
- **模块**: storage
- **状态**: ✅ 通过
- **测试用例**: 3 个
- **通过**: 3 个
- **失败**: 0 个
- **耗时**: 0.00s

#### 测试用例列表


1. **toJSON/fromJSON 应该安全序列化与解析**
   - 状态: ✅ 通过
   - 耗时: 2.03ms
   - 分组: core/storage/tools
   

2. **withPrefix 应生成带前缀键名**
   - 状态: ✅ 通过
   - 耗时: 0.24ms
   - 分组: core/storage/tools
   

3. **withTTL 应包装值与过期时间**
   - 状态: ✅ 通过
   - 耗时: 0.44ms
   - 分组: core/storage/tools
   


### console-transport.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/logger/console-transport.spec.ts`
- **模块**: logger
- **状态**: ✅ 通过
- **测试用例**: 12 个
- **通过**: 12 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当使用console.info输出debug日志**
   - 状态: ✅ 通过
   - 耗时: 4.41ms
   - 分组: core/logger/console-transport
   

2. **应当使用console.info输出info日志**
   - 状态: ✅ 通过
   - 耗时: 0.71ms
   - 分组: core/logger/console-transport
   

3. **应当使用console.warn输出warn日志**
   - 状态: ✅ 通过
   - 耗时: 0.66ms
   - 分组: core/logger/console-transport
   

4. **应当使用console.error输出error日志**
   - 状态: ✅ 通过
   - 耗时: 0.77ms
   - 分组: core/logger/console-transport
   

5. **应当正确格式化时间戳**
   - 状态: ✅ 通过
   - 耗时: 0.43ms
   - 分组: core/logger/console-transport
   

6. **应当正确格式化参数**
   - 状态: ✅ 通过
   - 耗时: 0.95ms
   - 分组: core/logger/console-transport
   

7. **应当正确格式化上下文**
   - 状态: ✅ 通过
   - 耗时: 0.46ms
   - 分组: core/logger/console-transport
   

8. **应当正确格式化标签**
   - 状态: ✅ 通过
   - 耗时: 0.43ms
   - 分组: core/logger/console-transport
   

9. **应当正确处理完整日志载荷**
   - 状态: ✅ 通过
   - 耗时: 0.57ms
   - 分组: core/logger/console-transport
   

10. **应当正确处理空参数**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/logger/console-transport
   

11. **应当正确处理空数组参数**
   - 状态: ✅ 通过
   - 耗时: 0.36ms
   - 分组: core/logger/console-transport
   

12. **应当正确处理空对象上下文**
   - 状态: ✅ 通过
   - 耗时: 0.25ms
   - 分组: core/logger/console-transport
   


### error-transport.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/logger/error-transport.spec.ts`
- **模块**: logger
- **状态**: ✅ 通过
- **测试用例**: 9 个
- **通过**: 9 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **应当上报error级别日志**
   - 状态: ✅ 通过
   - 耗时: 4.00ms
   - 分组: core/logger/error-transport
   

2. **应当忽略非error级别日志**
   - 状态: ✅ 通过
   - 耗时: 0.69ms
   - 分组: core/logger/error-transport
   

3. **应当处理无参数的error日志**
   - 状态: ✅ 通过
   - 耗时: 0.87ms
   - 分组: core/logger/error-transport
   

4. **应当处理只有args的error日志**
   - 状态: ✅ 通过
   - 耗时: 1.64ms
   - 分组: core/logger/error-transport
   

5. **应当处理只有context的error日志**
   - 状态: ✅ 通过
   - 耗时: 1.09ms
   - 分组: core/logger/error-transport
   

6. **应当处理复杂error日志**
   - 状态: ✅ 通过
   - 耗时: 0.83ms
   - 分组: core/logger/error-transport
   

7. **应当处理空数组和空对象**
   - 状态: ✅ 通过
   - 耗时: 0.31ms
   - 分组: core/logger/error-transport
   

8. **应当正确处理异步操作**
   - 状态: ✅ 通过
   - 耗时: 0.35ms
   - 分组: core/logger/error-transport
   

9. **应当正确处理reportError异常**
   - 状态: ✅ 通过
   - 耗时: 1.35ms
   - 分组: core/logger/error-transport
   


### logger-tools.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/logger/logger-tools.spec.ts`
- **模块**: logger
- **状态**: ✅ 通过
- **测试用例**: 2 个
- **通过**: 2 个
- **失败**: 0 个
- **耗时**: 0.01s

#### 测试用例列表


1. **withContext 应正确合并上下文与 extra**
   - 状态: ✅ 通过
   - 耗时: 1.73ms
   - 分组: core/logger/tools
   

2. **toErrorContext 应从错误中提取可用信息**
   - 状态: ✅ 通过
   - 耗时: 7.44ms
   - 分组: core/logger/tools
   


### logger.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/logger/logger.spec.ts`
- **模块**: logger
- **状态**: ✅ 通过
- **测试用例**: 15 个
- **通过**: 15 个
- **失败**: 0 个
- **耗时**: 0.03s

#### 测试用例列表


1. **应当输出debug级别日志**
   - 状态: ✅ 通过
   - 耗时: 8.15ms
   - 分组: core/logger/logger
   

2. **应当输出info级别日志**
   - 状态: ✅ 通过
   - 耗时: 1.48ms
   - 分组: core/logger/logger
   

3. **应当输出warn级别日志**
   - 状态: ✅ 通过
   - 耗时: 1.21ms
   - 分组: core/logger/logger
   

4. **应当输出error级别日志**
   - 状态: ✅ 通过
   - 耗时: 1.40ms
   - 分组: core/logger/logger
   

5. **应当正确过滤低级别日志**
   - 状态: ✅ 通过
   - 耗时: 0.74ms
   - 分组: core/logger/logger
   

6. **应当输出高级别日志**
   - 状态: ✅ 通过
   - 耗时: 0.80ms
   - 分组: core/logger/logger
   

7. **应当支持禁用日志**
   - 状态: ✅ 通过
   - 耗时: 0.47ms
   - 分组: core/logger/logger
   

8. **应当支持启用日志**
   - 状态: ✅ 通过
   - 耗时: 0.96ms
   - 分组: core/logger/logger
   

9. **应当正确合并上下文**
   - 状态: ✅ 通过
   - 耗时: 1.37ms
   - 分组: core/logger/logger
   

10. **应当正确处理标签**
   - 状态: ✅ 通过
   - 耗时: 1.12ms
   - 分组: core/logger/logger
   

11. **应当支持传输器管理**
   - 状态: ✅ 通过
   - 耗时: 0.82ms
   - 分组: core/logger/logger
   

12. **应当生成正确的时间戳**
   - 状态: ✅ 通过
   - 耗时: 4.65ms
   - 分组: core/logger/logger
   

13. **应当处理复杂上下文**
   - 状态: ✅ 通过
   - 耗时: 2.09ms
   - 分组: core/logger/logger
   

14. **应当处理无参数日志**
   - 状态: ✅ 通过
   - 耗时: 0.92ms
   - 分组: core/logger/logger
   

15. **应当支持所有日志级别**
   - 状态: ✅ 通过
   - 耗时: 2.16ms
   - 分组: core/logger/logger
   


### useAuth.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/store/useAuth.spec.ts`
- **模块**: store
- **状态**: ✅ 通过
- **测试用例**: 6 个
- **通过**: 6 个
- **失败**: 0 个
- **耗时**: 0.10s

#### 测试用例列表


1. **应当提供正确的认证功能**
   - 状态: ✅ 通过
   - 耗时: 71.48ms
   - 分组: core/store/modules/user/useAuth
   

2. **应当提供只读认证状态**
   - 状态: ✅ 通过
   - 耗时: 5.74ms
   - 分组: core/store/modules/user/useAuth
   

3. **应当正确同步认证状态**
   - 状态: ✅ 通过
   - 耗时: 8.79ms
   - 分组: core/store/modules/user/useAuth
   

4. **应当正确检查权限**
   - 状态: ✅ 通过
   - 耗时: 4.95ms
   - 分组: core/store/modules/user/useAuth
   

5. **应当正确处理认证操作**
   - 状态: ✅ 通过
   - 耗时: 4.95ms
   - 分组: core/store/modules/user/useAuth
   

6. **应当正确管理生命周期**
   - 状态: ✅ 通过
   - 耗时: 4.46ms
   - 分组: core/store/modules/user/useAuth
   


### user.store.spec.ts

- **路径**: `D:/node/vue-template/v1.2/tests/core/store/user.store.spec.ts`
- **模块**: store
- **状态**: ✅ 通过
- **测试用例**: 9 个
- **通过**: 9 个
- **失败**: 0 个
- **耗时**: 0.05s

#### 测试用例列表


1. **应当具有正确的初始状态**
   - 状态: ✅ 通过
   - 耗时: 22.25ms
   - 分组: core/store/modules/user/user.store
   

2. **应当从认证模块同步状态**
   - 状态: ✅ 通过
   - 耗时: 13.37ms
   - 分组: core/store/modules/user/user.store
   

3. **getters 应正确反映状态**
   - 状态: ✅ 通过
   - 耗时: 3.54ms
   - 分组: core/store/modules/user/user.store
   

4. **应当提供正确的用户信息摘要**
   - 状态: ✅ 通过
   - 耗时: 2.39ms
   - 分组: core/store/modules/user/user.store
   

5. **应当正确管理状态**
   - 状态: ✅ 通过
   - 耗时: 1.57ms
   - 分组: core/store/modules/user/user.store
   

6. **应当正确启动认证同步**
   - 状态: ✅ 通过
   - 耗时: 3.79ms
   - 分组: core/store/modules/user/user.store
   

7. **应当正确刷新状态**
   - 状态: ✅ 通过
   - 耗时: 2.89ms
   - 分组: core/store/modules/user/user.store
   

8. **应当正确处理无用户状态**
   - 状态: ✅ 通过
   - 耗时: 1.23ms
   - 分组: core/store/modules/user/user.store
   

9. **应当正确处理权限检查边界情况**
   - 状态: ✅ 通过
   - 耗时: 1.18ms
   - 分组: core/store/modules/user/user.store
   



## 🧪 所有测试用例详情

### 按状态分类

#### ✅ 通过的测试用例 (132个)


1. **应当保持 axios 返回值形态（AxiosResponse）**
   - 耗时: 5.08ms
   - 分组: core/http/http-minimal

2. **toData 应当返回 data 部分**
   - 耗时: 1.38ms
   - 分组: core/http/http-minimal

3. **GET/POST/PUT/DELETE 应可调用并返回 AxiosResponse**
   - 耗时: 1.23ms
   - 分组: core/http/http-minimal

4. **错误应保持为 AxiosError（由调用方自行断言/处理）**
   - 耗时: 2.13ms
   - 分组: core/http/http-minimal

5. **POST 请求应传递 body 并返回 AxiosResponse**
   - 耗时: 0.84ms
   - 分组: core/http/http-minimal

6. **PUT 请求应传递 body 并返回 AxiosResponse**
   - 耗时: 0.63ms
   - 分组: core/http/http-minimal

7. **DELETE 请求应返回 AxiosResponse**
   - 耗时: 0.31ms
   - 分组: core/http/http-minimal

8. **请求错误应被原样抛出（AxiosError）**
   - 耗时: 0.57ms
   - 分组: core/http/http-minimal

9. **应当支持复杂请求配置（headers/params/timeout）**
   - 耗时: 0.79ms
   - 分组: core/http/http-minimal

10. **应当返回完整的 AxiosResponse（包含headers/status等）**
   - 耗时: 0.37ms
   - 分组: core/http/http-minimal

11. **应当正确安装错误处理器**
   - 耗时: 2.55ms
   - 分组: core/error/error-handler

12. **应当捕获和处理 Vue 错误**
   - 耗时: 9.64ms
   - 分组: core/error/error-handler

13. **应当捕获未处理的 Promise 拒绝**
   - 耗时: 5.67ms
   - 分组: core/error/error-handler

14. **应当支持自定义错误级别**
   - 耗时: 2.83ms
   - 分组: core/error/error-handler

15. **未登录访问受保护路由应跳转登录**
   - 耗时: 68.53ms
   - 分组: core/router/guard

16. **应当正确创建路由实例**
   - 耗时: 3.84ms
   - 分组: core/router/router

17. **应当使用HTML5 history模式**
   - 耗时: 0.84ms
   - 分组: core/router/router

18. **应当包含所有静态路由**
   - 耗时: 2.37ms
   - 分组: core/router/router

19. **应当正确配置登录路由**
   - 耗时: 0.77ms
   - 分组: core/router/router

20. **应当正确配置首页路由**
   - 耗时: 1.15ms
   - 分组: core/router/router

21. **应当正确解析路由**
   - 耗时: 0.59ms
   - 分组: core/router/router

22. **应当支持路由导航**
   - 耗时: 0.36ms
   - 分组: core/router/router

23. **应当包含正确数量的路由**
   - 耗时: 1.20ms
   - 分组: core/router/router

24. **应当使用动态导入的组件**
   - 耗时: 0.92ms
   - 分组: core/router/router

25. **应当支持正确的路由结构**
   - 耗时: 0.48ms
   - 分组: core/router/router

26. **应当支持路由守卫**
   - 耗时: 0.48ms
   - 分组: core/router/router

27. **应当支持路由元信息**
   - 耗时: 0.49ms
   - 分组: core/router/router

28. **应当支持路由参数**
   - 耗时: 0.43ms
   - 分组: core/router/router

29. **应当支持查询参数**
   - 耗时: 1.54ms
   - 分组: core/router/router

30. **应当包含正确数量的路由**
   - 耗时: 3.38ms
   - 分组: core/router/static-routes

31. **应当包含登录路由**
   - 耗时: 0.64ms
   - 分组: core/router/static-routes

32. **应当包含首页路由**
   - 耗时: 0.45ms
   - 分组: core/router/static-routes

33. **应当正确配置登录路由组件**
   - 耗时: 0.21ms
   - 分组: core/router/static-routes

34. **应当正确配置首页路由组件**
   - 耗时: 0.36ms
   - 分组: core/router/static-routes

35. **应当使用动态导入的组件**
   - 耗时: 0.28ms
   - 分组: core/router/static-routes

36. **应当包含必要的路由属性**
   - 耗时: 0.34ms
   - 分组: core/router/static-routes

37. **应当具有唯一的路由路径**
   - 耗时: 0.48ms
   - 分组: core/router/static-routes

38. **应当支持路由扩展**
   - 耗时: 1.43ms
   - 分组: core/router/static-routes

39. **应当支持路由守卫**
   - 耗时: 0.74ms
   - 分组: core/router/static-routes

40. **应当支持嵌套路由**
   - 耗时: 0.67ms
   - 分组: core/router/static-routes

41. **应当支持重定向**
   - 耗时: 0.54ms
   - 分组: core/router/static-routes

42. **应当支持路由别名**
   - 耗时: 1.32ms
   - 分组: core/router/static-routes

43. **应当支持路由名称**
   - 耗时: 1.00ms
   - 分组: core/router/static-routes

44. **应当正确恢复认证状态**
   - 耗时: 6.37ms
   - 分组: core/auth/init

45. **UserStore应当从认证模块恢复状态**
   - 耗时: 8.97ms
   - 分组: core/auth/init

46. **认证模块和UserStore状态应保持一致**
   - 耗时: 3.30ms
   - 分组: core/auth/init

47. **清除认证状态应同时清除UserStore状态**
   - 耗时: 2.47ms
   - 分组: core/auth/init

48. **应当正确设置和获取令牌**
   - 耗时: 4.93ms
   - 分组: core/auth

49. **应当正确清除令牌**
   - 耗时: 4.09ms
   - 分组: core/auth

50. **应当正确设置和获取用户信息**
   - 耗时: 4.68ms
   - 分组: core/auth

51. **应当返回正确的认证状态**
   - 耗时: 1.42ms
   - 分组: core/auth

52. **应当正确更新用户权限**
   - 耗时: 10.01ms
   - 分组: core/auth

53. **localStorage基本操作应正常工作**
   - 耗时: 1.22ms
   - 分组: core/auth/persistence (简化测试)

54. **应当正确清除数据**
   - 耗时: 0.28ms
   - 分组: core/auth/persistence (简化测试)

55. **加载不存在的数据应返回null**
   - 耗时: 0.09ms
   - 分组: core/auth/persistence (简化测试)

56. **应当将 JSON-like 字符串作为原始字符串处理**
   - 耗时: 3.14ms
   - 分组: core/storage/json-like-string

57. **应当将真实 JSON 对象使用序列化格式处理**
   - 耗时: 1.72ms
   - 分组: core/storage/json-like-string

58. **应当正确区分 JSON-like 字符串和真实对象**
   - 耗时: 0.90ms
   - 分组: core/storage/json-like-string

59. **应当正确处理各种 JSON-like 字符串格式**
   - 耗时: 1.32ms
   - 分组: core/storage/json-like-string

60. **应当正确处理边界情况**
   - 耗时: 0.50ms
   - 分组: core/storage/json-like-string

61. **应当兼容旧数据格式**
   - 耗时: 0.19ms
   - 分组: core/storage/json-like-string

62. **应当正确处理混合数据类型**
   - 耗时: 0.85ms
   - 分组: core/storage/json-like-string

63. **应当智能识别字符串为原始数据**
   - 耗时: 3.78ms
   - 分组: core/storage/smart-serialization

64. **应当智能识别基本类型为原始数据**
   - 耗时: 0.95ms
   - 分组: core/storage/smart-serialization

65. **应当智能识别复杂类型为序列化数据**
   - 耗时: 2.25ms
   - 分组: core/storage/smart-serialization

66. **应当支持明确指定序列化选项**
   - 耗时: 1.19ms
   - 分组: core/storage/smart-serialization

67. **应当支持明确指定非序列化选项**
   - 耗时: 0.68ms
   - 分组: core/storage/smart-serialization

68. **应当向后兼容旧数据格式**
   - 耗时: 1.13ms
   - 分组: core/storage/smart-serialization

69. **应当正确处理混合数据类型**
   - 耗时: 1.53ms
   - 分组: core/storage/smart-serialization

70. **应当正确设置和获取存储项**
   - 耗时: 5.39ms
   - 分组: core/storage/storage-manager

71. **应当正确删除存储项**
   - 耗时: 1.72ms
   - 分组: core/storage/storage-manager

72. **应当正确清空所有存储项**
   - 耗时: 2.69ms
   - 分组: core/storage/storage-manager

73. **应当支持序列化控制**
   - 耗时: 0.72ms
   - 分组: core/storage/storage-manager

74. **应当支持默认值**
   - 耗时: 0.44ms
   - 分组: core/storage/storage-manager

75. **应当支持存储类型切换**
   - 耗时: 1.13ms
   - 分组: core/storage/storage-manager

76. **应当正确添加键名前缀**
   - 耗时: 0.33ms
   - 分组: core/storage/storage-manager

77. **toJSON/fromJSON 应该安全序列化与解析**
   - 耗时: 2.03ms
   - 分组: core/storage/tools

78. **withPrefix 应生成带前缀键名**
   - 耗时: 0.24ms
   - 分组: core/storage/tools

79. **withTTL 应包装值与过期时间**
   - 耗时: 0.44ms
   - 分组: core/storage/tools

80. **应当使用console.info输出debug日志**
   - 耗时: 4.41ms
   - 分组: core/logger/console-transport

81. **应当使用console.info输出info日志**
   - 耗时: 0.71ms
   - 分组: core/logger/console-transport

82. **应当使用console.warn输出warn日志**
   - 耗时: 0.66ms
   - 分组: core/logger/console-transport

83. **应当使用console.error输出error日志**
   - 耗时: 0.77ms
   - 分组: core/logger/console-transport

84. **应当正确格式化时间戳**
   - 耗时: 0.43ms
   - 分组: core/logger/console-transport

85. **应当正确格式化参数**
   - 耗时: 0.95ms
   - 分组: core/logger/console-transport

86. **应当正确格式化上下文**
   - 耗时: 0.46ms
   - 分组: core/logger/console-transport

87. **应当正确格式化标签**
   - 耗时: 0.43ms
   - 分组: core/logger/console-transport

88. **应当正确处理完整日志载荷**
   - 耗时: 0.57ms
   - 分组: core/logger/console-transport

89. **应当正确处理空参数**
   - 耗时: 0.36ms
   - 分组: core/logger/console-transport

90. **应当正确处理空数组参数**
   - 耗时: 0.36ms
   - 分组: core/logger/console-transport

91. **应当正确处理空对象上下文**
   - 耗时: 0.25ms
   - 分组: core/logger/console-transport

92. **应当上报error级别日志**
   - 耗时: 4.00ms
   - 分组: core/logger/error-transport

93. **应当忽略非error级别日志**
   - 耗时: 0.69ms
   - 分组: core/logger/error-transport

94. **应当处理无参数的error日志**
   - 耗时: 0.87ms
   - 分组: core/logger/error-transport

95. **应当处理只有args的error日志**
   - 耗时: 1.64ms
   - 分组: core/logger/error-transport

96. **应当处理只有context的error日志**
   - 耗时: 1.09ms
   - 分组: core/logger/error-transport

97. **应当处理复杂error日志**
   - 耗时: 0.83ms
   - 分组: core/logger/error-transport

98. **应当处理空数组和空对象**
   - 耗时: 0.31ms
   - 分组: core/logger/error-transport

99. **应当正确处理异步操作**
   - 耗时: 0.35ms
   - 分组: core/logger/error-transport

100. **应当正确处理reportError异常**
   - 耗时: 1.35ms
   - 分组: core/logger/error-transport

101. **withContext 应正确合并上下文与 extra**
   - 耗时: 1.73ms
   - 分组: core/logger/tools

102. **toErrorContext 应从错误中提取可用信息**
   - 耗时: 7.44ms
   - 分组: core/logger/tools

103. **应当输出debug级别日志**
   - 耗时: 8.15ms
   - 分组: core/logger/logger

104. **应当输出info级别日志**
   - 耗时: 1.48ms
   - 分组: core/logger/logger

105. **应当输出warn级别日志**
   - 耗时: 1.21ms
   - 分组: core/logger/logger

106. **应当输出error级别日志**
   - 耗时: 1.40ms
   - 分组: core/logger/logger

107. **应当正确过滤低级别日志**
   - 耗时: 0.74ms
   - 分组: core/logger/logger

108. **应当输出高级别日志**
   - 耗时: 0.80ms
   - 分组: core/logger/logger

109. **应当支持禁用日志**
   - 耗时: 0.47ms
   - 分组: core/logger/logger

110. **应当支持启用日志**
   - 耗时: 0.96ms
   - 分组: core/logger/logger

111. **应当正确合并上下文**
   - 耗时: 1.37ms
   - 分组: core/logger/logger

112. **应当正确处理标签**
   - 耗时: 1.12ms
   - 分组: core/logger/logger

113. **应当支持传输器管理**
   - 耗时: 0.82ms
   - 分组: core/logger/logger

114. **应当生成正确的时间戳**
   - 耗时: 4.65ms
   - 分组: core/logger/logger

115. **应当处理复杂上下文**
   - 耗时: 2.09ms
   - 分组: core/logger/logger

116. **应当处理无参数日志**
   - 耗时: 0.92ms
   - 分组: core/logger/logger

117. **应当支持所有日志级别**
   - 耗时: 2.16ms
   - 分组: core/logger/logger

118. **应当提供正确的认证功能**
   - 耗时: 71.48ms
   - 分组: core/store/modules/user/useAuth

119. **应当提供只读认证状态**
   - 耗时: 5.74ms
   - 分组: core/store/modules/user/useAuth

120. **应当正确同步认证状态**
   - 耗时: 8.79ms
   - 分组: core/store/modules/user/useAuth

121. **应当正确检查权限**
   - 耗时: 4.95ms
   - 分组: core/store/modules/user/useAuth

122. **应当正确处理认证操作**
   - 耗时: 4.95ms
   - 分组: core/store/modules/user/useAuth

123. **应当正确管理生命周期**
   - 耗时: 4.46ms
   - 分组: core/store/modules/user/useAuth

124. **应当具有正确的初始状态**
   - 耗时: 22.25ms
   - 分组: core/store/modules/user/user.store

125. **应当从认证模块同步状态**
   - 耗时: 13.37ms
   - 分组: core/store/modules/user/user.store

126. **getters 应正确反映状态**
   - 耗时: 3.54ms
   - 分组: core/store/modules/user/user.store

127. **应当提供正确的用户信息摘要**
   - 耗时: 2.39ms
   - 分组: core/store/modules/user/user.store

128. **应当正确管理状态**
   - 耗时: 1.57ms
   - 分组: core/store/modules/user/user.store

129. **应当正确启动认证同步**
   - 耗时: 3.79ms
   - 分组: core/store/modules/user/user.store

130. **应当正确刷新状态**
   - 耗时: 2.89ms
   - 分组: core/store/modules/user/user.store

131. **应当正确处理无用户状态**
   - 耗时: 1.23ms
   - 分组: core/store/modules/user/user.store

132. **应当正确处理权限检查边界情况**
   - 耗时: 1.18ms
   - 分组: core/store/modules/user/user.store




## 📈 测试趋势

### 模块覆盖率


- **http**: 100.0% (10/10)

- **error**: 100.0% (4/4)

- **router**: 100.0% (29/29)

- **auth**: 100.0% (12/12)

- **storage**: 100.0% (24/24)

- **logger**: 100.0% (38/38)

- **store**: 100.0% (15/15)


### 性能指标

- **平均测试时间**: 3.29ms/测试
- **最慢模块**: store
- **最快模块**: http

## 🎯 建议

- ⚡ 优化慢速测试用例，特别是超过100ms的测试

---

*报告生成时间: 2025/10/21 16:59:24*
*数据来源: test-results/results.json*
