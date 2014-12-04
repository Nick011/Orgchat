Orgchat
============

A drop-in javascript chat service for social and enterprise apps.

See demo folder for an example.

Requirements:
- NodeJS
- Redis


Instructions:
- Download
``` npm install ```
``` redis-server ```
``` node app.js --dev=true ```

http://localhost:8000/socket.io/chat/demo/?username=Steve&id=4
http://localhost:8000/socket.io/chat/demo/?username=Alice&id=3


Live Demo:
http://orgchat.herokuapp.com/socket.io/chat/demo/?username=John&id=3
http://orgchat.herokuapp.com/socket.io/chat/demo/?username=Alice&id=2


Development:
``` gulp ```
``` node app.js --dev=true ```
