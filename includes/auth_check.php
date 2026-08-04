<?php

if(session_status() ===  PHP_SESSION_NONE){
    session_start();
}

function require_login(){
    if(!isset($_SESSION['user_id'])){
        header('Location: /shoryan/pages/login.php');
        exit;
    }
}

function require_admin(){
    require_login();
    if($_SESSION['role'] !== 'admin'){
        header('Location: /shoryan/pages/index.php');
    }
}