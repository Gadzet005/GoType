# Ответы на наиболее часто возникающие вопросы

## 1. Как запустить игру на Линукс?

1 Скачайте установочный файл со страницы скачивания приложения.s

2 В директории с установочным файлом пропишите команду 
```bash
sudo chmod a+x GoType-linux.AppImage
```

3 Запустите игру
```bash
./GoType-linux.AppImage
```

4 В случаее возникновении ошибок, запустите её с флагом --no-sandbox
```bash
./GoType-linux.AppImage --no-sandbox
```

## 2. Где найти id уровня, или пользователя, чтобы его забанить?

На странице рейтинга или уровней, соответственно

## 3. Почему я дошёл до конца уровня, а мне выводится сообщение, что уровен провален?

На то, пройден уровень или нет, влияет общий процент точности за весь уровень:

Если общий процент точности за весь уровень меньше 60%, то уровень считается проваленым.

Если общий процент точности за весь уровень лежит в полуинтервале [60%; 70%), то уровень считается пройденным с классом точности D.

Аналогично, если лежит в полуинтервалах [70%; 80%), [80%; 90%), [90%, 100%), то уровень считается пройденным с классами точностии C, B, A соответственно.

Если уровень пройден без ошибок, то уровень считается пройденным с классом точности S.