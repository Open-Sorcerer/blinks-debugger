async function validateURL(url: string) {
  const urlObj = new URL(url);
  const baseUrl = `${urlObj.origin}${urlObj.pathname.replace(/\/$/, "")}`;
  const queryParams = urlObj.search;

  const actionsUrl = `${baseUrl}/actions.json`;
  const response = await fetch(actionsUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${actionsUrl}`);
  }

  const actionsResponse: ActionBlink = await response.json();

  // Iterate through each rule in actionsResponse
  for (const action of actionsResponse.rules) {
    const { pathPattern, apiPath } = action;

    if (pathPattern === "/") {
      return `${baseUrl}/${apiPath.replace(/^\//, "")}${queryParams}`;
    }

    // Construct regex pattern based on pathPattern
    const regexPattern = `^${pathPattern
      .replace(/\*\*/g, "(.*)")
      .replace(/\*/g, "([^/]*)")}$`;
    const pathRegex = new RegExp(regexPattern);

    const match = urlObj.pathname.match(pathRegex);

    if (match) {
      // Extract matched parts from the regex
      const capturedGroups = match.slice(1);

      // Replace corresponding parts in apiPath
      let newApiPath = apiPath;
      capturedGroups.forEach((group, index) => {
        newApiPath = newApiPath.replace(`*${index + 1}`, group);
      });

      // If newApiPath still contains **, replace it with the first captured group
      if (newApiPath.includes("**")) {
        newApiPath = newApiPath.replace("**", capturedGroups[0]);
      }

      return `${baseUrl}/${newApiPath.replace(/^\//, "")}${queryParams}`;
    }
  }
}

interface ActionBlink {
  rules: Array<{
    pathPattern: string;
    apiPath: string;
  }>;
}

export { validateURL };
