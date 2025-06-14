import Handlebars from 'handlebars';

export function initHandlebars() {
    // Register JSON helpers
    Handlebars.registerHelper('json', (value) => {
        // For string values that need to be inserted into JSON strings
        if (typeof value === 'string') {
            return new Handlebars.SafeString(JSON.stringify(value).slice(1, -1));
        }
        return new Handlebars.SafeString(JSON.stringify(value));
    });

    Handlebars.registerHelper('jsonString', (value) => {
        // Always treat as string and escape for JSON
        return new Handlebars.SafeString(JSON.stringify(String(value)).slice(1, -1));
    });

    Handlebars.registerHelper('jsonValue', (value) => {
        // For complete JSON values (objects, arrays, etc.)
        return new Handlebars.SafeString(JSON.stringify(value));
    });
}
