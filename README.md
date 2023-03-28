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
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please write your first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please write your last name."],
    },
    image: {
      type: String,
      default:
        "https://www.atomos.co.uk/getmedia/ec2d2ef0-71ea-40b8-a76c-6eb00c0cc210/portrait_placeholder_6.png?width=600&height=600&ext=.png",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please add your email."],
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Please write your password."],
    },
    role: {
      type: String,
      enum: ["investee", "investor"],
      default: "investee",
      required: [true, "Please select your role."],
    },
    linkedIn: {
      type: String,
      unique: true,
    },
    company: {
      type: String,
      required: [
        true,
        "Please write the name of your company or the company for which you work.",
      ],
    },
    industry: {
      type: String,
      enum: [
        "All",
        "Agriculture",
        "Chems and materials",
        "Communication",
        "Construction",
        "Consumer goods and retail",
        "Consumer services",
        "Energy and environment",
        "Financial services",
        "Infrastructures",
        "Life science",
        "Real estate",
        "Transportation",
        "Digital mark",
        "IT/Tech",
        "Electronics",
        "Other",
      ],
      required: [true, "Please select the industries your work with."],
    },
    bio: {
      type: String,
      required: [true, "Please write your biography."],
      maxLength: 600,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

### Project

Projects in the database have the following properties:

```js
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please write the title of your project."],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "active",
        "initiation",
        "planning",
        "execution",
        "on hold",
        "closure stage",
        "closed",
      ],
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add the project description."],
    },
    industry: {
      type: [String],
      enum: [
        "All",
        "Agriculture",
        "Chems and materials",
        "Communication",
        "Construction",
        "Consumer goods and retail",
        "Consumer services",
        "Energy and environment",
        "Financial services",
        "Infrastructures",
        "Life science",
        "Real estate",
        "Transportation",
        "Digital mark",
        "IT/Tech",
        "Electronics",
        "Education",
        "Food and beverage",
        "Other",
      ],
      required: [true, "Please select the industries your work with."],
    },
    fundingNeeded: {
      type: String,
      required: [
        true,
        "Please select the type of funding you are looking for.",
      ],
      enum: ["pre-seed", "angel", "seed", "serie A, B or C", "none"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
```

### Reviews

Reviews in the database have the following properties:

```js
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please add the review's title."],
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please add your comments."],
      maxLength: 350,
    },
    personRating: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personRated: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

### Messages

Messages in the database have the following properties:

```js
const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Please write your message."],
    },
  },
  {
    timestamps: true,
  }
);
```

---

## API endpoints and usage

| Action                 | Method | Endpoint                    | Req.body            | Private/Public |
| ---------------------- | ------ | --------------------------- | ------------------- | -------------- |
| SIGN UP user           | POST   | /auth/signup                | TBD                 | Public         |
| LOG IN user            | POST   | /auth/login                 | { email, password } | Public         |
| GET logged in user     | GET    | /auth/me                    |                     | Private        |
| See profile            | GET    | /profile                    |                     | Private        |
| Edit profile           | PUT    | /profile/edit               | TBD                 | Private        |
| Get other user profile | GET    | /profile/:userId            |                     | Private        |
| GET projects           | GET    | /projects                   |                     | Public         |
| GET one project        | GET    | /projects/:projectId        |                     | Public         |
| POST project           | POST   | /projects/new               | TBD                 | Private        |
| Edit project           | PUT    | /projects/edit/:projectId   | TBD                 | Private        |
| Delete project         | DELETE | /projects/delete/:projectId |                     | Private        |
| Sends new review       | POST   | /reviews/new                | TBD                 | Private        |

---

## Useful links

- [Presentation slides]()
- [Frontend repository](https://github.com/patriciacostadacruz/frontend-template-m3)
- [Frontend deploy](https://investmate-pro.netlify.app/)
- [Deployed REST API](https://investmate.fly.dev/)
