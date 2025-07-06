# Admin app (frontend)

## Main directives

- DO NOT EXECUTE COMMANDS ON YOUR OWN. TELL ME AND I'LL EXECUTE THEM
- DO NOT MODIFY ENV FILES. USE A env.txt placeholder file. I'LL CHANGE IT LATER.

## Context

This app is is a fronted app for admins of the project Voces de la Extinción.
Here, the admins can perform all the actions that are related to the management of the project.

## Tech stack

- React
- TypeScript
- Vite
- RSuite (RSuite icons too)
- TanStack Router
- TanStack Query
- Formik
- Yup

* Every package is already installed.

## Routes

- Auth routes:
  - Login
  - Logout (after the user logout)
- Recording routes:
  - List
  - Detail
  - Create a recording
  - Update a recording
- User routes:
  - List
  - Detail
  - Create a user
  - Update a user
- Tag routes:
  - List
  - Detail
  - Create a tag
  - Update a tag

* Routes must be protected.

### Auth

This will be a simple section with a login and logout routes.
Login will show a simple login form (email, password) and trigger some validations.
Logout will be displayed when the user logs out from the app. It will have a "go to login" button

### Recordings

Recordings are the main resource of the app.
The list route will show a table with all the recordings. It will have a "create recording" button.
The table will display all the columns that we believe necessary.
It also should have some columns where the user can perform simple actions (edit, delete, etc.)
One of the main features here is the search and filter feature.
The table should be searchable by word, date, and tag.

The detail route will show a form with all the columns of the recording. It will have a
"back to list" button.
It will also have an Edit button.

The create route will show a form with all the columns of the recording. It will have a
"back to list" button.
The create route must follow the model of the recording and validate the data.
It will have a drag and drop feature to upload the audio file.

The update route will show a form with all the columns of the recording. It will have a
"back to list" button.
The update route must follow the model of the recording and validate the data.
It will have a drag and drop feature to upload the audio file.

### Users

Users are the users of the app.
The list route will show a table with all the users. It will have a "create user" button.
The table will display all the columns that we believe necessary.
It also should have some columns where the user can perform simple actions (edit, delete, etc.)
The table should be searchabke by email.

The detail route will show a form with all the columns of the user. It will have a
"back to list" button.
It will also have an Edit button.

The create route will show a form with all the columns of the user. It will have a
"back to list" button.

The update route will show a form with all the columns of the user. It will have a
"back to list" button.

### Tags

Tags are the tags of the app.
The list route will be a little more simple than the complex tables for Users or Recordings.
The tags are just that, tags. Just simple words, so we will display all the available tags with "pills" (search for a component in RSuite).

The way to add a tag must be simple, just a modal that will allow the user to add a tag.
Same for update a tag, just a modal that will allow the user to update a tag.

The way to delete a tag is a close button inside the same pill. It will show a confirmation modal.

## Components

I think we will need some highly reusable components:
Table, Modal, Notification(toast).

## Forms

All the forms must be created with Formik and Yup.

## Main layout

The app will be simple.
A header and a sidebar. Header for profile-related elements, sidebar for menu.
The "main content" section should be 100% width when is a table and 60% width when is a form.

## Styles

We will try to follow the same styles that Rsuite proposes.
I'd like a full setup of RSuite features (theme, colors, icons, etc.)

## Connection with backend

- This app will get all the data it needs from an API that we already created.
- All the context you need for this is in `backend_context.md`
