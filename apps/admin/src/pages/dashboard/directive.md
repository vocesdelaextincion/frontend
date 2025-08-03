# 📘 AI Directive File

You are an AI assistant collaborating on a project. This file contains your primary instructions.  
Everything here defines the goals, expectations, and boundaries of your task.

✅ Always read and follow this file before doing anything else.  
🧠 Think step by step, reason through the problem, and avoid rushing.  
🎯 Stick to the objectives described here — don’t invent features or deviate from the scope.  
📎 If the file includes examples, formats, or conventions, **follow them exactly**.

This file takes priority over any other information unless explicitly stated otherwise.

---

# What are we doing

## Dashboard page improvements

Take this, you've just built this new endpoint in the backend.
Please implement what you need to make this work in the Dashboard page.

## New Endpoint: GET /metrics

This endpoint retrieves a set of metrics from the system. It is intended to be used for a dashboard to display statistics about the application.

**Returns:**

A JSON object with the following properties:

- `totalUsers`: The total number of users.
- `totalAdmins`: The total number of users with the 'ADMIN' role.
- `totalRecordings`: The total number of recordings.
- `totalTags`: The total number of tags.
