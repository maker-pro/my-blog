---
title: "JWT认证"
---

# JWT认证

#### 使用 lcobucci/jwt 认证， 使用 composer require lcobucci/jwt 安装jwt
JWT（JSON Web Token）是一种开放标准（RFC 7519），它定义了一种简洁的方式来安全地传输信息，以便从发件人到接收者。它使用JSON对象作为数据格式，并使用签名和加密算法来保护数据的完整性和机密性。JWT可以用于身份验证，保护API网关，以及在应用程序之间安全地传输数据。

```
<?php
/**
 * Token.php
 * User: Joe
 * Date: 2023/4/6
 * Time: 14:59
 */

namespace App\Models;

use DateTimeImmutable;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\Plain;
use Lcobucci\JWT\Validation\Constraint\IdentifiedBy;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\PermittedFor;

class Token
{
    protected $issuer = "http://composer";
    protected $audience = "http://composer";
    protected $id = "WTizYTcvwlpa";
    // jwt_sercetkey一定要保管好不要泄露,这里使用随机密码生成器搞一个https://suijimimashengcheng.bmcx.com/
    protected static $jwt_sercetkey = "TKLbJdrXUNL4CU3fuWpE4ORjLUefgC0q";
    /**
     * 签发token
     */
    public function getToken()
    {
        $issued_at = new DateTimeImmutable();
        $can_only_be_used_after = new DateTimeImmutable('+30 second');
        $expires_at = new DateTimeImmutable('+60 second');

        $config = self::getConfig();
        assert($config instanceof Configuration);
        /*
        iss 【issuer】签发人(可以是,发布者的url地址)
        sub 【subject】该JWT所面向的用户，用于处理特定应用，不是常用的字段
        aud 【audience】受众人（可以是客户端的url地址，用作验证是否是指定的人或者url）
        exp 【expiration】 该jwt销毁的时间；unix时间戳
        nbf 【not before】 该jwt的使用时间不能早于该时间；unix时间戳
        iat 【issued at】 该jwt的发布时间；unix 时间戳
        jti 【JWT ID】 该jwt的唯一ID编号
        */
        $token = $config->builder()
            ->issuedBy($this->issuer) // iss 【issuer】签发人(可以是,发布者的url地址)
            ->permittedFor($this->audience) // aud 【audience】受众人（可以是客户端的url地址，用作验证是否是指定的人或者url）
            ->identifiedBy($this->id, true) // jti 【JWT ID】 该jwt的唯一ID编号
            ->issuedAt($issued_at) // iat 【issued at】 该jwt的发布时间；unix 时间戳
            ->canOnlyBeUsedAfter($can_only_be_used_after) // nbf 【not before】 该jwt的使用时间不能早于该时间；unix时间戳即生效时间
            ->expiresAt($expires_at) // exp 【expiration】 该jwt销毁的时间；unix时间戳
            ->withClaim('id', 1) // 用户id
            ->withClaim('uname', "Joe") // 用户名
            ->getToken($config->signer(), $config->signingKey()); // 生成签名

        return $token->toString(); //返回签名字符串
    }
    /**
     * 验证 jwt token 并返回其中的用户id
     */
    public function verifyToken_other($token)
    {
        $now = new DateTimeImmutable();
        try {
            $config = self::getConfig(); //获取配置
            assert($config instanceof Configuration);
            $token = $config->parser()->parse($token);//解析
            assert($token instanceof Plain);

            $claims = $token->claims();
            if ($now < $claims->get('nbf')) {
                die(json_encode([
                    'code' => 404,
                    'msg' => '还未生效'
                ]));
            }
            if ($now > $claims->get('exp')) {
                die(json_encode([
                    'code' => 404,
                    'msg' => '已经过期'
                ]));
            }

            //验证jwt id是否匹配
            $validate_jwt_id = new IdentifiedBy($this->id);
            //验证签发人url是否正确
            $validate_issued = new IssuedBy($this->issuer);
            //验证客户端url是否匹配
            $validate_aud = new PermittedFor($this->audience);
            $config->setValidationConstraints($validate_jwt_id, $validate_issued, $validate_aud);
            $constraints = $config->validationConstraints();
            if (!$config->validator()->validate($token, ...$constraints))
            {
                die(json_encode([
                    'code' => 404,
                    'msg' => '无效token!'
                ]));
            }
        }
        catch (\Exception $e)
        {
            die(json_encode([
                'code' => 404,
                'msg' => "错误:" . $e->getMessage()
            ]));
        }

        $jwtContent = $token->claims();  // 这是jwt token中存储的所有信息
        return json_encode(array('uid'=>$jwtContent->get("id"),'username'=>$jwtContent->get("uname")),JSON_UNESCAPED_UNICODE);  // 获取uid和username
    }
    /**
     * 加密解密使用的配置
     * @return Configuration
     */
    public static function getConfig()
    {
        $configuration = Configuration::forSymmetricSigner(
            new Sha256(), //除了256你还可以使用384,512的加密算法
            InMemory::base64Encoded(self::$jwt_sercetkey) //这里可重写
        );
        return $configuration;
    }
}
```
