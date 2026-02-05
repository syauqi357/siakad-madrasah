# API Design Decision: Why Use POST for Bulk Score Updates?

This document explains the reasoning behind choosing the `POST` HTTP method over `PUT` or `PATCH` for the `/api/scores` endpoint that handles bulk saving and updating of student scores.

## Understanding PUT, PATCH, and POST

First, let's clarify the standard "RESTful" meaning of these HTTP verbs:

*   **`PUT` (Replace):** Used to **completely replace** a resource at a specific URL. If the resource doesn't exist, it may be created. It is idempotent, meaning multiple identical requests have the same effect as a single one.
    *   *Analogy:* Replacing an entire page in a book with a new one.

*   **`PATCH` (Partially Update):** Used to apply a **partial modification** to a resource. You only send the data for the fields you want to change.
    *   *Analogy:* Using white-out to correct a single word on a page.

*   **`POST` (Create or Process):** Most commonly used to **create a new resource** within a collection. However, it is also the standard "catch-all" verb for any operation that doesn't fit the strict semantics of other methods. It is used to submit data to a specific resource for processing.
    *   *Analogy:* Submitting a batch of application forms to an office for processing.

## Why PUT and PATCH Are Not a Good Fit Here

Our score-saving operation has three key characteristics that make `PUT` and `PATCH` unsuitable:

1.  **It's a Bulk Operation:** We are sending an array of scores for many different students in a single request. `PUT` and `PATCH` are designed to operate on a *single resource* identified by a specific URL (e.g., `/api/scores/123`), not a collection of them.

2.  **It's a Mixed "Upsert" Action:** The data we send is a set of instructions. For each student's score in the array, the server must decide whether to `INSERT` a new record or `UPDATE` an existing one. This is a complex transaction, not a simple replacement or partial update of a single entity.

3.  **The URL Represents a Collection:** Our endpoint, `/api/scores`, represents the entire collection of scores. We are not updating the collection itself, but rather asking it to process a batch of changes within it. This is a classic use case for `POST`.

## Conclusion: POST is the Correct Choice

Given the nature of the operation—a bulk, transactional "upsert" on a collection resource—`POST` is the most appropriate and widely understood HTTP method. It correctly signals that the client is submitting a block of data to be processed by the server, which may result in the creation and/or update of multiple resources.
