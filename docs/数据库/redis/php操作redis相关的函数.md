---
title: "php操作redis相关的函数"
---

# php操作redis相关的函数

### php redis set存储

> 在 PHP 中使用 Redis 的 Set（集合） 存储数据，主要是通过 phpredis 扩展提供的 sAdd()、sMembers() 等方法来操作。Redis 的 Set 特点是无序、元素唯一（自动去重）。

* 1、实例

```
<?php
// 1. 实例化并连接 Redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$key = 'user_tags:1001';

// 2. 添加元素到 Set (sAdd)
// 重复的元素会自动被过滤，返回值是成功新加入的元素个数
$redis->sAdd($key, 'php');
$redis->sAdd($key, 'mysql');
$redis->sAdd($key, 'redis');
$redis->sAdd($key, 'php'); // 重复添加会被忽略

// 3. 获取 Set 中的所有成员 (sMembers)
$members = $redis->sMembers($key);
print_r($members); 
// 输出类似于：Array ( [0] => redis [1] => mysql [2] => php )

// 4. 判断某个元素是否在 Set 中 (sIsMember)
$exists = $redis->sIsMember($key, 'php'); // 返回 true (1)

// 5. 获取 Set 中元素的数量 (sCard)
$count = $redis->sCard($key); // 返回 3

// 6. 删除 Set 中的指定元素 (sRem)
$redis->sRem($key, 'mysql');

// 7. 随机弹出一个或多个元素 (sPop)
$randomItem = $redis->sPop($key); 
```

* 2、常用 Set 操作方法对照表


| PHP 方法名 | Redis 命令 | 功能描述 |
|------------|----------|-------|
| sAdd($key, $val1, $val2...) | SADD | 将一个或多个元素添加到集合中 |
| sMembers($key) | SMEMBERS | 获取集合中的所有成员 |
| sIsMember($key, $val) | SISMEMBER | 判断该值是否是集合的成员 |
| sCard($key) | SCARD | 获取集合中元素的总个数 |
| sRem($key, $val1, $val2...) | SREM | 删除集合中指定的元素 |
| sPop($key, [$count]) | SPOP | 随机移除并返回集合中的元素 |
| sRandMember($key, [$count]) | SRANDMEMBER | 随机返回集合中的指定数量元素，但不删除 |
| sInter($key1, $key2...) | SINTER | 求多个集合的交集 |
| sUnion($key1, $key2...) | SUNION | 求多个集合的并集 |
| sDiff($key1, $key2...) | SDIFF | 求多个集合的差集 |


------

### php redis hash存储

> 在 PHP 中使用 Redis 的 Hash（哈希） 类型，非常适合用来存储对象（例如用户信息、商品详情等），可以直接把对象或关联数组的多个字段存放在同一个 Redis 键下面。

* 1、实例常用 Hash 操作方法


> 设置字段（HSet / HMSet）

```php
// 设置单个字段
$redis->hSet('user:1001', 'name', '张三');

// 批量设置多个字段 (HMSet)
$redis->hMSet('user:1001', [
    'age' => 25,
    'email' => 'zhangsan@example.com',
    'score' => 99.5
]);
```

> 获取字段（HGet / HMGet / HGetAll）

```php
// 获取单个字段
$name = $redis->hGet('user:1001', 'name'); // 输出: 张三

// 批量获取指定字段
$info = $redis->hMGet('user:1001', ['name', 'age']); 
// 输出: ['name' => '张三', 'age' => 25]

// 获取 Hash 表中的所有字段和值
$all = $redis->hGetAll('user:1001'); 
// 输出: ['name' => '张三', 'age' => '25', 'email' => '...', 'score' => '99.5']
```

> 数值增减（HIncrBy / HIncrByFloat）

```php
// 年龄自增 1
$redis->hIncrBy('user:1001', 'age', 1);

// 浮点数增加
$redis->hIncrByFloat('user:1001', 'score', 0.5);
```

> 判断字段是否存在与删除字段

```php
// 判断字段是否存在
$exists = $redis->hExists('user:1001', 'name'); // 返回 true 或 false

// 删除一个或多个字段
$redis->hDel('user:1001', 'email');
```

> 获取所有键、值或数量

```php
$keys = $redis->hKeys('user:1001.   ');   // 获取所有 field
$vals = $redis->hVals('user:1001');     // 获取所有 value
$len  = $redis->hLen('user:1001');     // 获取 field 的数量
```

* 个人测试

```
$users = [
    [
        'id' => 1,
        'username' => 'zhangsan',
        'age' => 25,
        'gender' => 1,
        'email' => 'zhangsan@example.com',
        'phone' => '13812345678',
        'created_at' => '2026-03-15 10:30:20',
    ],
    [
        'id' => 2,
        'username' => 'lisi',
        'age' => 32,
        'gender' => 0,
        'email' => 'lisi@example.com',
        'phone' => '13923456789',
        'created_at' => '2026-04-20 14:25:36',
    ],
    [
        'id' => 3,
        'username' => 'wangwu',
        'age' => 28,
        'gender' => 1,
        'email' => 'wangwu@example.com',
        'phone' => '13634567890',
        'created_at' => '2026-05-11 09:15:42',
    ],
    [
        'id' => 4,
        'username' => 'zhaoliu',
        'age' => 41,
        'gender' => 1,
        'email' => 'zhaoliu@example.com',
        'phone' => '13745678901',
        'created_at' => '2026-01-08 16:42:18',
    ],
    [
        'id' => 5,
        'username' => 'chenxi',
        'age' => 23,
        'gender' => 0,
        'email' => 'chenxi@example.com',
        'phone' => '15056789012',
        'created_at' => '2026-06-22 11:08:55',
    ],
    [
        'id' => 6,
        'username' => 'yangyang',
        'age' => 36,
        'gender' => 0,
        'email' => 'yangyang@example.com',
        'phone' => '15167890123',
        'created_at' => '2026-02-17 08:35:12',
    ],
    [
        'id' => 7,
        'username' => 'huangbo',
        'age' => 29,
        'gender' => 1,
        'email' => 'huangbo@example.com',
        'phone' => '15278901234',
        'created_at' => '2026-07-03 19:20:45',
    ],
    [
        'id' => 8,
        'username' => 'zhoumin',
        'age' => 45,
        'gender' => 0,
        'email' => 'zhoumin@example.com',
        'phone' => '15589012345',
        'created_at' => '2026-08-14 13:50:30',
    ],
    [
        'id' => 9,
        'username' => 'wujun',
        'age' => 31,
        'gender' => 1,
        'email' => 'wujun@example.com',
        'phone' => '15690123456',
        'created_at' => '2026-09-05 07:45:16',
    ],
    [
        'id' => 10,
        'username' => 'sunhao',
        'age' => 27,
        'gender' => 1,
        'email' => 'sunhao@example.com',
        'phone' => '15801234567',
        'created_at' => '2026-10-01 12:18:40',
    ],
];

foreach ($users as $user) {
    $redis->hMset('user:' . $user['id'], $user);
}

var_dump($redis->hGetAll('user:4'));
$redis->hincrBy('user:4', 'age', 5);
var_dump($redis->hGetAll('user:4'));

var_dump($redis->hGetAll('user:1'));

var_dump($redis->hMget('user:1', ['id', 'age']));

var_dump($redis->hKeys('user:1'));
```

* 2、常用 Hash 操作方法对照表

|PHP 方法名						|Redis 命令	|功能描述										|
|-|-|-|
|hSet($key, $field, $val)		|HSET		|设置哈希表中指定字段的值						|
|hMSet($key, $array)			|HMSET		|同时将多个 field-value (域-值) 对设置到哈希表中|
|hGet($key, $field)				|HGET		|获取存储在哈希表中指定字段的值					|
|hMGet($key, $fields)			|HMGET		|获取所有给定字段的值							|
|hGetAll($key)					|HGETALL	|获取在哈希表中指定 key 的所有字段和值			|
|hDel($key, $field1, $field2...)|HDEL		|删除一个或多个哈希表字段						|
|hExists($key, $field)			|HEXISTS	|查看哈希表 key 中，指定的字段是否存在			|
|hIncrBy($key, $field, $incr)	|HINCRBY	|为哈希表 key 中的指定字段的整数值加上增量		|
|hLen($key)						|HLEN		|获取哈希表中字段的数量							|
|hKeys($key)					|HKEYS		|获取哈希表中的所有字段名						|
|hVals($key)					|HVALS		|获取哈希表中的所有值							|

* 3、Hash 存储的优缺点

	* 优点：
		* 节省内存：当字段较少时，Redis 底层会采用 ziplist（压缩列表）存储，比直接存多个 String 类型或整个序列化大字符串更加节省内存。
		* 修改灵活：可以只修改对象中的某一个属性（如 hSet 更新积分），而不需要把整个 JSON 读出、反序列化、修改后再写回。
	* 缺点：
		* 无法对 Hash 内部的 field 设置独立的过期时间（Redis 的过期时间只能设置在最外层的 Key 上）。
		* 相比直接存字符串，API 操作稍微复杂一点。

* 4、为什么存储对象优先选择 Hash，而不是 String (JSON)？

	* 如果你要存储一个用户对象，通常有两种方案：
		* 1. String 方案：将数组 json_encode 成字符串，用 set('user:1001', $json) 存储。
		* 2. Hash 方案：用 hMSet('user:1001', $array) 存储。
	* Hash 的绝对优势：
		* 局部修改极方便：如果只想修改用户的年龄或增加登录次数，Hash 只需要调用 hSet 或 hIncrBy。而 String 方案必须先读取整串 JSON、反序列化、修改字段、再重新序列化存回去，并发高时容易产生数据覆盖并发冲突。
		* 节省内存：Redis 内部对连续的小 Hash 会使用特定的紧凑编码（ziplist/listpack），在字段较少时比纯字符串更省内存。


------

### php redis zset存储

> 在 PHP 中使用 Redis 的 Zset（有序集合，Sorted Set） 存储数据，主要是通过 phpredis 扩展提供的 zAdd()、zRange() 等方法来操作。Zset 的特点是元素唯一，但每个元素都会关联一个分数（Score），Redis 会根据分数自动进行从小到大的排序。

* 1、实例

```php
<?php
// 1. 实例化并连接 Redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$key = 'game_leaderboard';

// 2. 添加元素到 Zset (zAdd)
// 语法：zAdd(key, score, value) 或者是批量格式
// 注意：如果元素已存在，zAdd 会更新其对应的分数 (Score)
$redis->zAdd($key, 4500, 'PlayerA');
$redis->zAdd($key, 5200, 'PlayerB');
$redis->zAdd($key, 3100, 'PlayerC');

// 批量添加的方法（根据 phpredis 版本，可能支持传入数组）
// $redis->zAdd($key, ['NX'], 6000, 'PlayerD'); 

// 3. 获取成员的排名/分数 (zRank / zScore)
$score = $redis->zScore($key, 'PlayerB'); // 返回 5200
$rank = $redis->zRank($key, 'PlayerB');    // 返回 1 (从0开始升序算起，PlayerC(3100)是0)
$revRank = $redis->zRevRank($key, 'PlayerB'); // 返回 0 (降序排名，分数最高排名为0)

// 4. 获取前三名并输出分数 (zRevRange - 降序获取)
// 参数：key, 开始位置, 结束位置, 是否返回分数
$topPlayers = $redis->zRevRange($key, 0, 2, true);
print_r($topPlayers);
/*
输出类似：
Array (
    [PlayerB] => 5200
    [PlayerA] => 4500
    [PlayerC] => 3100
)
*/

// 5. 增加指定成员的分数 (zIncrBy)
$redis->zIncrBy($key, 1000, 'PlayerC'); // 给 PlayerC 增加 1000 分

// 6. 获取集合中元素的总数量 (zCard)
$count = $redis->zCard($key); // 返回 3

// 7. 删除指定成员 (zRem)
$redis->zRem($key, 'PlayerA');
```

* 用 zset创建排行榜

```
$rankKey = 'NewRank';

$newList = [
    '油罐车与罐体脱节，司机冲上前徒手拉' => 1,
    '多个西方国家促公民远离沙特机场' => 9,
    '平安半年报超预期！净利润大增36%' => 7,
    '事关肉制品、校园食品，中央政法委发文！这些行为将被从严查处' => 10
];

foreach ($newList as $title => $score) {
    $redis->zadd($rankKey, $score, $title);
}

var_dump($redis->zRank($rankKey, '油罐车与罐体脱节，司机冲上前徒手拉'));
var_dump($redis->zRange($rankKey, 0, 2));
var_dump($redis->zRevRange($rankKey, 0, 2));

```


* 2、常用 Zset 操作方法对照表

| PHP 方法名 | Redis 命令 | 功能描述 |
|------------|-----------|-----------|
| zAdd($key, $score, $value) | ZADD | 向有序集合添加一个或多个成员，或者更新已存在成员的分数 |
| zCard($key) | ZCARD | 获取有序集合的成员数量 |
| zCount($key, $min, $max) | ZCOUNT | 计算在指定分数区间的成员数量 |
| zIncrBy($key, $value, $member) | ZINCRBY | 为有序集合指定成员的分数加上增量 |
| zRange($key, $start, $end, [$withscores]) | ZRANGE | 返回指定排名区间内的成员（分数从低到高） |
| zRevRange($key, $start, $end, [$withscores]) | ZREVRANGE | 返回指定排名区间内的成员（分数从高到低） |
| zRangeByScore($key, $min, $max, [$options]) | ZRANGEBYSCORE | 返回指定分数区间内的成员（升序） |
| zRevRangeByScore($key, $max, $min, [$options]) | ZREVRANGEBYSCORE | 返回指定分数区间内的成员（降序） |
| zRank($key, $member) | ZRANK | 返回指定成员的排名（升序，从0开始） |
| zRevRank($key, $member) | ZREVRANK | 返回指定成员的排名（降序，第1名返回0） |
| zRem($key, $member1, $member2...) | ZREM | 移除有序集合中的一个或多个成员 |
| zRemRangeByScore($key, $min, $max) | ZREMRANGEBYSCORE | 移除有序集合中给定的分数区间的所有成员 |

* 3、注意事项
	* 相同分数的排序：如果有两个成员的分数（Score）相同，Redis 会按照成员名字（Value）的 ASCII 码字符串字典序进行排序。
	* 内存占用：Zset 内部使用了跳跃表（SkipList）和哈希表两种数据结构，因此其内存消耗在所有 Redis 数据类型中是相对较高的。
	* 数据限制：当需要分页展示排行榜时，直接使用 zRevRange 配合 $start 和 $end 即可做到极速响应，优于传统数据库的 ORDER BY。

------

### php redis list存储

> 在 PHP 中使用 Redis 的 List（列表） 存储数据，主要是通过 phpredis 扩展提供的 lPush()、rPush()、lPop()、rPop() 等方法来操作 [1]。Redis 的 List 是一个双向链表，支持在头部（左侧）或尾部（右侧）插入和弹出元素，特点是元素有序、可重复。

* 例子

```php
<?php
// 1. 实例化并连接 Redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$key = 'task_queue';

// 清空旧数据（方便测试）
$redis->del($key);

// 2. 写入数据（Push 操作）
// lPush: 从左侧（头部）插入元素
$redis->lPush($key, 'task1');
$redis->lPush($key, 'task2'); // 此时队列顺序：task2 -> task1

// rPush: 从右侧（尾部）插入元素
$redis->rPush($key, 'task3'); // 此时队列顺序：task2 -> task1 -> task3

// 3. 查看列表长度 (lLen)
$length = $redis->lLen($key); // 返回 3

// 4. 获取列表中的元素（不弹出数据，仅查看）
// lRange(key, start, end): 0 表示第一个元素，-1 表示最后一个元素
$allTasks = $redis->lRange($key, 0, -1);
print_r($allTasks);
/*
输出顺序：
Array (
    [0] => task2
    [1] => task1
    [2] => task3
)
*/

// 通过索引获取单个元素 (lIndex)
$secondTask = $redis->lIndex($key, 1); // 返回 'task1'

// 5. 弹出数据（Pop 操作 - 数据会被真正移除）
// lPop: 从左侧弹出
$leftItem = $redis->lPop($key); // 返回 'task2'

// rPop: 从右侧弹出
$rightItem = $redis->rPop($key); // 返回 'task3'

// 6. 裁剪列表 (lTrim) - 只保留指定区间内的元素，其余删除
// 比如只保留前 100 个元素：$redis->lTrim($key, 0, 99);
```

* 2、常用 List 操作方法对照表

|PHP 方法名						|Redis 命令	|功能描述													|
|-|-|-|
|lPush($key, $val1, $val2...)	|LPUSH		|在列表头部（左侧）插入一个或多个值							|
|rPush($key, $val1, $val2...)	|RPUSH		|在列表尾部（右侧）插入一个或多个值							|
|lPop($key)						|LPOP		|移出并获取列表的第一个元素（左侧）							|
|rPop($key)						|RPOP		|移出并获取列表的最后一个元素（右侧）						|
|blPop($keys, $timeout)			|BLPOP		|LPOP 的阻塞版本，如果没有元素会等待直到超时或有新数据 [1]	|
|brPop($keys, $timeout)			|BRPOP		|RPOP 的阻塞版本，多用于秒杀或消息队列消费 [1]				|
|lLen($key)						|LLEN		|获取列表长度												|
|lRange($key, $start, $end)		|LRANGE		|获取列表指定范围内的元素（0 到 -1 表示全部）				|
|lIndex($key, $index)			|LINDEX		|通过索引获取列表中的元素									|
|lSet($key, $index, $val)		|LSET		|通过索引修改列表中某个元素的值								|
|lRem($key, $value, $count)		|LREM		|移除列表中与指定值相等的元素								|
|lTrim($key, $start, $end)		|LTRIM		|让列表只保留指定区间内的元素，其余的都删掉					|
