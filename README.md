Запускаете через npm run dev

Проверка модуля аутентификации

1. Создаете пользователя через контроллер localhost:3000/auth/signin
   Передаете { login, password } в body
   Получаете в ответе токены (acccess, refresh)

2. НЕОБЯЗАТЕЛЬНО Можете доплнительно залогиниться через localhost:3000/auth/login
   Передаете { login, password } в body
   Получаете в ответе токены (acccess, refresh)

3. НЕОБЯЗАТЕЛЬНО Можете доплнительно получить новый access token через localhost:3000/auth/refresh
   Refresh токен должен быть в хедере Cookie. Он сам устанавливается после отправки запроса на /signin либо /login

Проверка модуля авторизации

1. Отправляете запрос на контроллер localhost:3001/validateAccessToken
   Передаете AccessToken в заголовке Authorization после Bearer
   Если в ответе success === true, то авторизация успешна
