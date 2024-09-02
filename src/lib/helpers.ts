async function validateURL(url: string) {
  try {
    const dialAPI = await fetch("https://dial.to/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const response = (await dialAPI.json()) as APIResponse;
    console.log(response);
    return response.result.post[0]?.link;
  } catch (error) {
    console.error(error);
  }
}

export { validateURL };

// Basic types
type HTTPMethod = "GET" | "POST" | "OPTIONS";
type Status = "ok" | "error";
type URL = string;

// Complex subtypes
interface Availability {
  status: Status;
}

interface CORSData {
  isValid: boolean;
  errors: CORSError[];
}

interface CORSError {
  header: string;
  requiredValue: string;
  actualValue: string | null;
}

interface CORS {
  status: Status;
  data: CORSData;
}

interface ActionLink {
  label: string;
  href: URL;
  parameters?: ActionParameter[];
}

interface ActionParameter {
  name: string;
  label: string;
}

interface ResponseData {
  icon: URL;
  title: string;
  description: string;
  links: {
    actions: ActionLink[];
  };
}

interface GetResponse {
  status: Status;
  data: ResponseData;
}

interface GetResult {
  link: URL;
  availability: Availability;
  responseBody: GetResponse;
  cors: CORS;
}

interface PostResult {
  link: URL;
  label: string;
  availability: Availability;
  cors: CORS;
}

interface OptionsResult {
  link: URL;
  availability: Availability;
  cors: CORS;
}

// Main interface
interface APIResponse {
  type: string;
  result: {
    get: GetResult;
    post: PostResult[];
    options: OptionsResult;
  };
}
