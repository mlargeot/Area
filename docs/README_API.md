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
**Parameters**: *user_id=1*<br>
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

The detailed routes section will go here, with subsections for each category.
