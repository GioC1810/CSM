[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s309685 Cacopardi Giorgio 

# Server side

## API Server

### Authenitcated API

- DELETE `/logout` (api to perform the logout from the session)
  
  - request parameters and request body: none
  - response body content for authenitcated user:
  ```json
  {
    "result": "logout executed"
  } 
  ```
  - response body content for non authenitcated user:
  ```json
  {
    "error": "NOT AUTHENTICATED - GO AWAY"
  }
  ```
- POST `/page/` (api to create and add a new page)
  content-type: application/json
  - request parameters: none
  - request body:
   ```json
  {
    "title" : "page title",
    "author" : "user1@gmail.com",
    "creationDate" : "01/01/2011",
    "publicationDate" : "",
    "contents" : [
        {
            "type": "header",
            "content": "prova header",
            "position" : 1
        },
        {
            "type": "image",
            "content": "piramide.jpg",
            "position" : 2
        } 
    ]
  }
  ```
  - response body content for correct request:
    
  ```json
  {
     "message": "page inserted correctly with its content"
  } 
   ```
  - response body content for incorrect request:
  ```json
  {
    "error": "the type of the content is not valid"
  }
  ```
- PUT `/page/:id` (api to modify an existing page)
  content-type: application/json
  - request parameters: id of the page to modify
  - request body:
 ```json
  {
    "title" : "page title",
    "author" : "user1@gmail.com",
    "creationDate" : "01/01/2011",
    "publicationDate" : "",
    "contents" : [
        {
            "type": "header",
            "content": "prova header",
            "position" : 1
        },
        {
            "type": "image",
            "content": "piramide.jpg",
            "position" : 2
        } 
    ]
  }
  ```
  - response body content for correct request:
  ```json
  {
     "message": "page modified correctly"
  } 
  ```
  - response bodies content for incorrect requests:

  -for error about missing content or invalid date
  ```json
  {
    "error": "error description"
  }
  ```
  -for validation error like title length or contents number
  ```json
  {
    "errors": [
        {
            "type": "field",
            "value": "a",
            "msg": "Invalid value",
            "path": "id",
            "location": "params"
        }
    ]
  }
  ```
 -for error about operation on the page not valid(like a not admin user who attempts to modify a page of another user)
  ```json
  {
    "error": "user not authorized to perform this operation"
  }
  ```

- DELETE `/page/:id` (api to delete an existing page)
  content-type: application/json
  - request parameters: id of the page to delete
  - request body: none
  - response body content for correct request:
  ```json
  {
    "msg": "page correctly eliminated"
  }
  ```
  - response body content for id not present:
  ```json
  {
    "error": "page not present in the db"
  }
  ```
  -for error about operation on the page not valid(like a not admin user who attempts to delete a page of another user)
  ```json
  {
    "error": "user not authorized to perform this operation"
  }

### Not Authenitcated API

- POST `/login` (api to perform the login)
  
  content-type: application/json
  - request body content :
  ```json
  {
    "username" : "user1@gmail.com",
    "password" : "password"
  }
  ```
  - response body content for correct credentials:
  ```json
  {
    "username": "user1@gmail.com",
    "role": "admin",
    "nickname": "user1" 
  } 
  ```
  - response body content for wrong credentials:
    status 401, Unauthorized
- GET `/page/all` (api to retrieve all the pages available)
- in the case of an authenitcated user it returns all the pages
- in the case of a non authenitcated user it returns only the published pages
  
  content-type: application/json
  
  - request parameters and request body content: none
    
  - response body content :
  ```json
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
  ```
  - response body content in case some errors occurs (typically db ERROR):
    
    status 500
    ```json
    {
      "error" : "an error occurred",
      "content" : "error description"
    }
    ```
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
