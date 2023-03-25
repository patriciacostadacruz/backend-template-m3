# investMate REST API

## Description

This is a the backend repository for the React application `investMate`.

---

## Instructions

When cloning the project, change the <code>sample.env</code> file name for <code>.env</code>. The project will run on **PORT 8000**.

Then, run:

```bash
npm install
```

## Scripts

- To start the project run:

```bash
npm run start
```

- To start the project in development mode, run:

```bash
npm run dev
```

- To seed the database, run:

```bash
npm run seed
```

---

## Models

### User

Users in the database have the following properties:

```js
TBD;
```

### Project

Projects in the database have the following properties:

```js
TBD;
```

### Reviews

Reviews in the database have the following properties:

```js
TBD;
```

---

## API endpoints and usage

| Action                                 | Method | Endpoint                           | Req.body            | Private/Public |
| -------------------------------------- | ------ | ---------------------------------- | ------------------- | -------------- |
| SIGN UP user                           | POST   | /api/v1/auth/signup                | TBD                 | Public         |
| LOG IN user                            | POST   | /api/v1/auth/login                 | { email, password } | Public         |
| GET logged in user                     | GET    | /api/v1/auth/me                    |                     | Private        |
| See profile                            | GET    | /api/v1/profile                    |                     | Private        |
| Edit profile                           | PUT    | /api/v1/profile/edit               |                     | Private        |
| Get other user profile                 | GET    | /api/v1/profile/:userId            |                     | Private        |
| GET projects                           | GET    | /api/v1/projects                   |                     | Public         |
| GET one project                        | GET    | /api/v1/projects/:projectId        |                     | Public         |
| POST project                           | POST   | /api/v1/projects/new               | TBD                 | Private        |
| Edit project                           | PUT    | /api/v1/projects/edit/:projectId   | TBD                 | Private        |
| Delete project                         | DELETE | /api/v1/projects/delete/:projectId |                     | Private        |
| Sends new review                       | POST   | /api/v1/reviews/new                | TBD                 | Private        |
| Retrieves all reviews added for a user | GET    | /api/v1/reviews/:userId            |                     | Private        |

---

## Useful links

- [Presentation slides]()
- [Frontend repository](https://github.com/patriciacostadacruz/frontend-template-m3)
- [Frontend deploy](https://investmate-pro.netlify.app/)
- [Deployed REST API](https://investmate.fly.dev/)
