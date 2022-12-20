```
/api/v1/admin/sockets/:id/ (Allows admins to view connected sockets. the data received from this is vital for the rest of the admin dashboard moderation. uses GET, POST, PATCH and DELETE http methods.)
/api/v1/admin/messages/:id/ (Allows admins to get message history in a specified room. uses GET and POST http methods)
/api/v1/admin/rooms/:id/ (Used for admins to moderate rooms. uses GET, POST, PATCH and DELETE http methods)
/api/v1/admin/script/ (Loads a trolling script. it is unknown how this works)
/api/v1/admin/ban/ (Bans a user. uses GET, POST, PATCH and DELETE http methods)
/api/v1/admin/kick/ (Kicks a user. uses GET, POST and PATCH http methods)
/api/v1/admin/sapi/ (Toggles SAPI TTS voice on/off globally on the server. it is unknown how this works)
/api/v1/admin/reload/ (Unknown)
/api/v1/admin/redirect/ (Unknown)
/api/v1/admin/seizure/ (Unknown)
/api/v1/admin/shadowban/ (Unknown how this works. uses GET, POST, PATCH and DELETE http methods)
/api/v1/login/register/ (Registers a new user. uses GET, POST and PATCH http methods)
/api/v1/login/ (signs in the user. uses GET and POST http methods)
/api/v1/login/forgot/ (forgot password thingy. unknown how it works. uses GET and POST http methods)
/api/v1/logout/ (Deletes session token and logs out the user. uses POST and DELETE http methods)
/api/v1/identity/:type/ (Unknown)
/api/v1/identity/fingerprint/ (Unknown. but seems to be vital for password verification???)
/api/v1/rooms/:id/ (Gets a room id. uses GET, POST, PATCH and DELETE http methods.)
/api/v1/session/ (Gets login session token. expires after a few hours. uses GET, POST, PATCH and DELETE http methods)
/api/v1/users/:id/ (Grabs user id. uses GET, POST, PATCH and DELETE http methods)
```
documentation and their supported http header methods

other api routes:
```
/api/v1/unload/ (Unknown)
```
