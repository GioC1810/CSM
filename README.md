[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s309685 Cacopardi Giorgio 

# Server side

## API Server

### Authenitcated API

- DELETE `/logout` (api to perform the logout from the session)
  - request parameters: none
  - response body content for authenitcated user:
  {
    "result": "logout executed"
  } 
  - response body content for non authenitcated user:
  {
    "error": "NOT AUTHENTICATED - GO AWAY"
  }
    
### Not Authenitcated API

- POST `/login` (api to perform the login).
  content-type: application/json
  - request body content :
  {
    "username" : "user1@gmail.com",
    "password" : "password"
  }
  - response body content for correct credentials:
  {
    "username": "user1@gmail.com",
    "role": "admin",
    "nickname": "user1" 
  } 
  - response body content for wrong credentials:
    status 401, Unauthorized
- GET `/page/all` (api to retrieve all the pages available)
  content-type: application/json
  - request parameters and request body content: none
  - response body content :
  [
    {
        "id": 4,
        "title": "page4",
        "author": "user4@gmail.com",
        "creationDate": "2000-12-31T23:00:00.000Z",
        "publicationDate": "2019-09-08T22:00:00.000Z",
        "type": "published",
        "contents": [
            {
                "id": 152,
                "type": "header",
                "content": "Et harum quidem rerum facilis est et expedita distinctio",
                "position": 0
            },
            {
                "id": 153,
                "type": "image",
                "content": "piramide.jpg",
                "position": 1
            }
        ]
    },
    {
        "id": 3,
        "title": "page3",
        "author": "user2@gmail.com",
        "creationDate": "2022-01-04T23:00:00.000Z",
        "publicationDate": "2022-09-22T22:00:00.000Z",
        "type": "published",
        "contents": [
            {
                "id": 76,
                "type": "header",
                "content": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga",
                "position": 1
            },
            {
                "id": 77,
                "type": "image",
                "content": "mare.jpg",
                "position": 2
            },
            {
                "id": 78,
                "type": "image",
                "content": "canoa.jpg",
                "position": 3
            }
        ]
    }
  ] 
  - response body content in case some errors occurs (typically db ERROR):
    status 500
    {
      error: "an error occurred",
      content: "error description"
    }

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

# Client side


## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

# Usage info

## Example Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
