# Spreadsheet App

A dynamic and interactive spreadsheet application built with React. This application allows users to manage tabular data with features like adding/deleting rows and columns, inline editing, and an innovative AI-powered column generation.

## Features

*   **Dynamic Table:** Create and manage data in a spreadsheet format.
*   **Row Operations:** Add new rows and delete existing rows.
*   **Column Operations:** Add new columns and delete existing columns.
*   **In-Cell Editing:** Easily edit data directly within cells.
*   **Header Editing:** Modify column headers on the fly.
*   **Context Menu:** Right-click for quick actions like deleting rows or columns.
*   **AI-Powered Column Generation:**
    *   Automatically generate new columns based on existing data using a Large Language Model (LLM).
    *   Currently configured to classify student majors (e.g., as 'Engineer' or 'Non-Engineer').
    *   Requires a backend service running at `http://localhost:8000/llm-complete`.

## Tech Stack

*   React
*   JavaScript
*   HTML/CSS
*   Create React App

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v14.x or later recommended)
*   npm (comes with Node.js)

### Installation

1.  Clone the repository (if applicable) or download the source code.
2.  Navigate to the project directory:
    ```bash
    cd spreadsheet-app
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm start
    ```
    This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

2.  **Important for AI Feature:** For the "AI Column Generation" feature to work, ensure you have the backend service running. This service is expected at `http://localhost:8000/llm-complete`. (Further setup instructions for the backend service should be added here if available).

## Available Scripts

In the project directory, you can run:

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project. Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Usage

*   **Adding Data:**
    *   Click the "Add Row" button to append a new row to the spreadsheet.
    *   Click the "Add Column" button in the header to append a new column.
*   **Editing Data:**
    *   Click on any cell to start editing its content. Press Enter to save or Escape to cancel.
    *   Click on a column header to edit its title. Press Enter to save or Escape to cancel.
*   **Deleting Data:**
    *   Right-click on a row number or column header to open the context menu.
    *   Select "Delete Row" or "Delete Column" to remove the respective item.
*   **AI Column Generation:**
    *   Click the "Create AI Column" button.
    *   This will send the current table data (specifically the 'Major' column by default) to a backend LLM service.
    *   The service will process the data based on a predefined prompt (e.g., classifying majors) and return values for a new column (e.g., "Engineering Classification").
    *   Ensure the backend service at `http://localhost:8000/llm-complete` is running.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/) (Or your preferred license. Consider adding a LICENSE file.)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).

