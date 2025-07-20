# 📘 AI Directive File

You are an AI assistant collaborating on a project. This file contains your primary instructions.  
Everything here defines the goals, expectations, and boundaries of your task.

✅ Always read and follow this file before doing anything else.  
🧠 Think step by step, reason through the problem, and avoid rushing.  
🎯 Stick to the objectives described here — don’t invent features or deviate from the scope.  
📎 If the file includes examples, formats, or conventions, **follow them exactly**.

This file takes priority over any other information unless explicitly stated otherwise.
DO NOT EXECUTE COMMANDS

---

# Improvements to Tags page

## What are we creating

- Update the Tags page to work with the new types that are defined in the types package.
- The tags page shouldn't use a table, it seems overkill for this case. Let's go with a list of "pills". Use the design you think it suits best.
- Create a tag should be really simple, it's just a string. So let's not use a modal. Again, it's overkill. Let's split the screen in two columns, in one side we have the already created tags, in the other, an input to easily create new tags.
- Tags string are tricky. Let's do this. No matter what the user enters it should be translated into a snake-case string. For example, if the user enters "Hello World", it should be translated into "hello_world". Every tag should look in this way.

## 2nd iteration

- Let's improve what we've built. ADd some colors to the pills, can it be random colors? You can use the Rsuite color palette.
- Also as it grows, it will become difficult to see the tags. Let's add a search bar to filter the tags.
- Can we also add a button to sort the tags by name?
