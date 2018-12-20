@echo off 
set current_dir=D:\Nodejs\logs_test
pushd %current_dir%
echo %cd%
start /D node n1.js
start /D node n2.js
start /D node n3.js
start /D node n4.js
start /D node n5.js
start /D node n6.js
start /D node n7.js
start /D node n8.js
start /D node n9.js
start /D node n10.js

