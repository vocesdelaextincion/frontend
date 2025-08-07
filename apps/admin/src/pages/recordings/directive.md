# 📘 AI Directive File

You are an AI assistant collaborating on a project. This file contains your primary instructions.  
Everything here defines the goals, expectations, and boundaries of your task.

✅ Always read and follow this file before doing anything else.  
🧠 Think step by step, reason through the problem, and avoid rushing.  
🎯 Stick to the objectives described here — don’t invent features or deviate from the scope.  
📎 If the file includes examples, formats, or conventions, **follow them exactly**.

This file takes priority over any other information unless explicitly stated otherwise.

---

## Scope

RecordingPage.tsx

## Task

- Implement and update this page based on the new structure of the recording and tag controllers.
- We have now a search and a pagination feature.
- Add a search bar to the top of the table. (Rsuite components)
- Add a way to trigger a rapid search based on tags, maybe a dropdown or something similar. The endpoint will be the same, using the search feature, but the search will be triggered by the tags.
- Add pagination buttons to the bottom of the table. (Rsuite components)

## Extra context

This is the function in the recording.controller:

/\*\*

- Get recordings with pagination and search functionality
-
- Query Parameters:
- - page: Page number (default: 1)
- - limit: Items per page (default: 10, max: 100)
- - search: Search term(s) to filter across title, description, and tags
- Can be a single term or multiple comma-separated terms
-
- Example usage:
- GET /recordings?page=2&limit=20&search=nature
- GET /recordings?search=bird sounds
- GET /recordings?search=nature,birds,animal
- GET /recordings?page=1&limit=5
  _/
  export const getRecordings = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise<void> => {
  try {
  // Parse pagination parameters
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) _ limit;

      // Parse search parameter
      const search = req.query.search as string;

      // Build where clause for search
      let whereClause = {};

      if (search) {
        // Split search terms by comma and trim whitespace
        const searchTerms = search.split(',').map(term => term.trim()).filter(term => term.length > 0);

        if (searchTerms.length > 0) {
          // Create OR conditions for each search term across all fields
          const searchConditions = searchTerms.map(term => ({
            OR: [
              {
                title: {
                  contains: term,
                  mode: 'insensitive' as const,
                },
              },
              {
                description: {
                  contains: term,
                  mode: 'insensitive' as const,
                },
              },
              {
                tags: {
                  some: {
                    name: {
                      contains: term,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
            ],
          }));

          // Use OR to match any of the search terms
          whereClause = {
            OR: searchConditions,
          };
        }
      }

      // Get total count for pagination metadata
      const totalCount = await prisma.recording.count({
        where: whereClause,
      });

      // Get recordings with pagination and search
      const recordings = await prisma.recording.findMany({
        where: whereClause,
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      res.status(200).json({
        data: recordings,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPreviousPage,
        },
        search: search || null,
      });

  } catch (error) {
  next(error);
  }
  };

---

This is the function in the tag.controller:

/\*\*

- Get tags with search functionality
-
- Query Parameters:
- - search: Search term(s) to filter across tag name
- Can be a single term or multiple comma-separated terms
-
- Example usage:
- GET /tags?search=nature
- GET /tags?search=bird sounds
- GET /tags?search=nature,birds,animal
  \*/
  export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise<void> => {
  try {
  // Parse search parameter
  const search = req.query.search as string;

      // Build where clause for search
      let whereClause = {};

      if (search) {
        // Split search terms by comma and trim whitespace
        const searchTerms = search
          .split(",")
          .map((term) => term.trim())
          .filter((term) => term.length > 0);

        if (searchTerms.length > 0) {
          // Create OR conditions for each search term across name field
          const searchConditions = searchTerms.map((term) => ({
            OR: [
              {
                name: {
                  contains: term,
                  mode: "insensitive" as const,
                },
              },
            ],
          }));

          // Use OR to match any of the search terms
          whereClause = {
            OR: searchConditions,
          };
        }
      }

      // Get tags with search
      const tags = await prisma.tag.findMany({
        where: whereClause,
        orderBy: {
          name: "asc",
        },
      });

      res.status(200).json({
        data: tags,
        search: search || null,
      });

  } catch (error) {
  next(error);
  }
  };
