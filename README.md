###--- deploy link https://grand-kitsune-4510f1.netlify.app/

Apify Actor Runner
This is a single-page web application built with React and Tailwind CSS that allows a user to authenticate with the Apify API, select from a list of available actors, and run an actor with a dynamically generated input form. The application then polls for the run status and displays the final results.

How to Install and Run the Application
This project is structured as a standard React application. To set it up on your local machine, you would typically follow these steps:

Clone the repository:

git clone [your-repo-url]
cd [your-repo-directory]

Install dependencies:

npm install
# or
yarn install

Start the development server:

npm run dev
# or
yarn dev

However, for the purpose of this collaborative environment, the code provided is self-contained within this document and does not require a local installation.

Which Actor Was Chosen for Testing?
The initial testing of the application focused on the crawler-google-places actor. This actor was chosen specifically because it helped identify a key behavior: it does not have a public input schema available via the Apify API. This allowed us to build robust error handling for this specific scenario.

For a successful demonstration of the dynamic form and actor execution, we can use a popular public actor such as:

Google Search Results Scraper (apify/google-search-scraper or ID nFJndFXA5zjCTuudP)

Website Content Crawler (apify/website-content-crawler or ID aYG0l9s7dbB7j3gbS)

Assumptions and Notable Design Choices
Component-Based Architecture: The application is broken down into a series of reusable React components (ApiKeyInput, ActorSelector, DynamicForm, and StatusDisplay). This makes the code modular, easier to read, and more maintainable.

Graceful Schema Handling: A core design choice was to handle actors that do not have a public input schema gracefully. When the API returns a 404 Not Found error for an actor's schema, the application displays a descriptive warning message instead of a fatal error, allowing the user to select another actor.

Dynamic Form Generation: The DynamicForm component dynamically creates form inputs based on the structure of the JSON schema returned by the Apify API. This ensures the UI is always in sync with the actor's expected input.

Apify API Integration: The application uses fetch to interact directly with the Apify API for authentication, fetching actor lists, retrieving schemas, and running actors. It also polls for the run status to provide real-time updates.

Modern React Practices: The code uses functional components, hooks (useState, useEffect, useCallback), and TypeScript for a type-safe and modern development experience.

Responsive UI: The UI is styled with Tailwind CSS and is fully responsive, ensuring a good user experience on both desktop and mobile devices.

Working Flow
Authentication: The user enters their Apify API key and clicks "Authenticate & Fetch Actors." The app fetches a list of actors associated with that key.

Actor Selection: A dropdown menu appears, populated with the names of the fetched actors.

Schema Fetching: When an actor is selected (or the first one is loaded by default), the app fetches its input schema.

Form Display:

If a schema is found, a dynamic form is rendered with fields corresponding to the schema's properties.

If no public schema is found, a yellow warning message is displayed.

Actor Execution: The user fills in the form and clicks "Run Actor." The app starts a new actor run via the API.

Status and Results: The app displays the run ID and polls the API every 5 seconds for the run status. Once the run is SUCCEEDED, the final results from the actor's default dataset are fetched and displayed.
