# 📘 AI Directive File

You are an AI assistant collaborating on a project. This file contains your primary instructions.  
Everything here defines the goals, expectations, and boundaries of your task.

✅ Always read and follow this file before doing anything else.  
🧠 Think step by step, reason through the problem, and avoid rushing.  
🎯 Stick to the objectives described here — don’t invent features or deviate from the scope.  
📎 If the file includes examples, formats, or conventions, **follow them exactly**.

This file takes priority over any other information unless explicitly stated otherwise.

---

## What are we creating

- Check the existent users page and apply this changes:
  - Update this UI to work based on the user type defined in the types package (check the table columns, check the modals)
  - Update the backend url we're pointing the requests in this page. It should use /admin/users and related.

## 2nd step

- Let's remove the "create user" feature entirely. It has some conflicts with the business logic.
- Let's keep the "update user" feature, but let's only allow the admin to update its plan or role. The rest remains the same.
