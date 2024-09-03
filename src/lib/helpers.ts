async function validateURL(url: string) {
  try {
    const dialAPI = await fetch("https://dial.to/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ url }),
    });
    const response = await dialAPI.json();
    return response as APIResponse;
  } catch (error) {
    console.error(error);
  }
}

export { validateURL };

// Basic types
export type Status = "ok" | "error";
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

interface Metadata {
  data: {
    meta: {
      title: string;
      description: string;
    };
    og: {
      title: string;
      description: string;
      image: URL;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image: URL;
    };
  };
  validity: {
    status: Status;
  };
}

interface ActionsJson {
  link: URL;
  cors: CORS;
  validity: {
    status: Status;
  };
  data: {
    rules: {
      pathPattern: string;
      apiPath: string;
    }[];
  };
}

// Main interface
interface APIResponse {
  type: string;
  result: {
    get: GetResult;
    post: PostResult[];
    options: OptionsResult;
    metadata: Metadata;
    actionsJson: ActionsJson;
  };
}
