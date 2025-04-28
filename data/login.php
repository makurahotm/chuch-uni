<?php
// 简单的登录验证逻辑
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 示例：简单的用户名和密码验证
    if ($username === 'admin' && $password === '123456') {
        echo "登录成功！欢迎，$username。";
    } else {
        echo "用户名或密码错误，请重试。";
    }
} else {
    echo "非法访问！";
}
?>
