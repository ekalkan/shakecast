python "%userprofile%\Shakecast\shakecast\admin\Windows\server_service.py" --startup=auto install
python "%userprofile%\Shakecast\shakecast\admin\Windows\web_server_service.py" --startup=auto install

python "%userprofile%\Shakecast\shakecast\admin\Windows\server_service.py" start
python "%userprofile%\Shakecast\shakecast\admin\Windows\web_server_service.py" start

pause