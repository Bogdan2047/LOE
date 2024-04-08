# Getting Started with Qmate terminal

## Browser
- better to disable autocomplete

## Requests and dataStorage
all requests and data managing goes in useFetchData component
styles stored in styles.js class

## Locales

all locales stored in /locales/{language}/translation.json

### if some locale displays as app.title
it means, that lib didn't found this path in json file.

#### check if it's exists 
`{
    "app": {
        "title": "some title"
    }
}`

## Environment variables
####config.json
will override all other variables except query in provided url

| name | description |
|---|---|
| `REACT_APP_API_URL` | base URL to Qmate API, `string` |
| `BRANCH_ID` | refresh set default branchId (if not overwritten by query), `number` id |
| `LOCALE` | set default locale value (if not overwritten by query), `string` UK, RU, EN |
| `TICKETS_PER_PAGE` | how many tickets displays per page, `number` items |
| `REACT_APP_ERROR_TIMEOUT` | sets value of error screen disappear speed, `number` ms |
| `REACT_APP_SUCCESS_TICKET_TIMEOUT` | sets value of success screen disappear speed, `number` ms |
| `primaryColor` | color of tickets backgrounds and other, `string` color |
| `secondaryColor` | color of texts that placed not on primary color, `string` color |
| `backgroundColor` | background Color or color of texts placed on primaryColor, `string`, color |
| `secondaryBackground` | default branch id, if not provided in url, `string`, color|
| `borderColor` | color of header border, disabled buttons, `string`, color |
| `imagePath` | path to header image in static files, `string`, path |

## .env Environment variables
will be overwritten by config.json variables;

| name | description |
|---|---|
| `REACT_APP_API_URL` | base URL to Qmate API, `string` |
| `REACT_APP_DEFAULT_BRANCH` | refresh set default branchId (if not overwritten by query), `number` ms |
| `REACT_APP_NUMBER_OF_NODE_COLUMNS` | refresh set default the number of columns displayed on the screen (if not overwritten by query), `number` ms |,
| `REACT_APP_DEFAULT_LOCALE` | set default locale value (if not overwritten by query), `string` UK, RU, EN |
| `REACT_APP_TICKETS_PER_PAGE` | how many tickets displays per page, `number` items |
| `REACT_APP_ERROR_TIMEOUT` | sets value of error screen disappear speed, `number` ms |
| `REACT_APP_SUCCESS_TICKET_TIMEOUT` | sets value of success screen disappear speed, `number` ms |
| `REACT_APP_PRIMARY_COLOR` | color of tickets backgrounds and other, `string` color |
| `REACT_APP_TICKET_SECONDARY_COLOR` | color of texts that placed not on primary color, `string` color |
| `REACT_APP_TICKET_BACKGROUND_COLOR` | background Color or color of texts placed on primaryColor, `string` color |
| `REACT_APP_TICKET_SECONDARY_BACKGROUND` | default branch id, if not provided in url, `string` color |
| `REACT_APP_TICKET_CALLING_BORDER_COLOR` | color of header border, disabled buttons, `string` color |
