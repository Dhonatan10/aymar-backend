@echo off
echo Navegando até a pasta do projeto...
cd /d "C:\Users\ws778\OneDrive\Área de Trabalho\Aymar Tech\backend\backend-node-aymar"

echo Fazendo git pull...
git pull origin main

echo Adicionando arquivos modificados...
git add .

echo Digite a mensagem do commit:
set /p msg=

git commit -m "%msg%"

echo Enviando para o repositório remoto...
git push origin main

echo Operação concluída!
pause
