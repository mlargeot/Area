<div style="text-align:center">
  <img src="https://github.com/user-attachments/assets/f92370ae-196c-437a-8437-972641222206" width="400" alt="logo"/>
</div>

# AR3M API

## Table of Contents
- [Explanations](#explanations)
  - [Swagger](#swagger)
  - [Route Format](#route-format)
- [Routes](#routes)
  - [About](#about)
  - [Authentication](#authentication)
  - [Actions](#actions)
  - [Reactions](#reactions)

## Explanations

### Swagger

Swagger provides a complete list of all available API routes, details about the required parameters, and even allows you to test the different API endpoints.

Swagger is accessible at the following URL:
```
http://localhost:8080/api
```

### Route Format

In this documentation, each API route will be described using the following format:

---
**Route Name**: *localhost:8080/register/example*<br>
**Method**: *POST*<br>
**Parameters** (optional): *user_id=1*<br>
**Body** (optional): 
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Status Code**: *201*<br>
**Response**:
```json
{
    "message": "User successfully created.",
    "token": "jboedkazkez12654dzadz6a5d4zadzad23dffefegsd"
}
```
---
> **Note**: This route and its data are provided as an example only.
<br>

## Routes
### About
---
**Route Name**: *localhost:8080/about.json*<br>
**Method**: GET<br>
**Status Code**: *200*<br>
**Response**:
```json
{
  "client": {
    "host": "10.101.53.35"
  },
  "server": {
    "current_time": 1531680780,
    "services": [{
      "name": "facebook",
      "actions": [
        {
          "name": "new_message_in_group",
          "description": "A new message is posted in the group"
        },
        {
          "name": "new_message_inbox",
          "description": "A new private message received by the user"
        },
        {
          "name": "new_like",
          "description": "The user gains a like from one of their messages"
        }
      ],
      "reactions": [{
          "name": "like_message",
          "description": "The user likes a message"
        }
      ]
    }]
  }
}
```
---
### Authentication
---
**Route Name**: *localhost:8080/register*<br>
**Method**: GET<br>
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Status Code**: *201*<br>
**Response**: 
```json
{
  "email": "user@example.com",
  "password": "$hashed_password",
  "isGoogleUser": false,
  "_id": "675628e68b37fadf8ff9b9b4",
  "__v": 0
}
```

---

**Route Name**: *localhost:8080/login*<br>
**Method**: GET<br>
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Status Code**: *200*<br>
**Response**: 
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiI2NzU2MjhlNjhiMzdmYWRmOGZmOWI5YjQiLCJpYXQiOjE3MzM2OTk5MDAsImV4cCI6MTczMzcwMzUwMH0.kCxXVMs0XtaYvwK1VTc0WiDKsQNPzikWQQFqiRspNcM"
}
```
---
### Actions

---
**Route Name**: *localhost:8080/actions*<br>
**Method**: GET<br>
**Status Code**: *200*<br>
**Response**:
```json
[
  {
    "service": "github",
    "actions": [
      {
        "name": "issue_assigned",
        "description": "Triggered when an issue is assigned to the user.",
        "argumentsNumber": 0,
        "argumentsExample": []
      }
    ]
  }
]
```
---

### Reactions
---
**Route Name**: *localhost:8080/reactions*<br>
**Method**: GET<br>
**Status Code**: *200*<br>
**Response**:
```json
[
  {
    "service": "discord",
    "reactions": [
      {
        "name": "send_webhook_message",
        "description": "Send message to the targeted discord webhook.",
        "argumentsNumber": 2,
        "argumentsExample": [
          {
            "name": "webhook_url",
            "description": "URL of the discord webhook to send message to.",
            "example": "https://discord/webhook/dzkadlzakjdlzakjdlzakjdlzakjd",
            "required": true
          },
          {
            "name": "message_content",
            "description": "Content of the message to send.",
            "example": "A new Issue as been assigned.",
            "required": true
          }
        ]
      }
    ]
  }
]
```
---