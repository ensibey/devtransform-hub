export interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  auth?: string;
}

export function parseCurlCommand(curlCommand: string): ParsedCurl {
  const result: ParsedCurl = {
    url: 'https://api.example.com/data',
    method: 'GET',
    headers: {},
  };

  const clean = curlCommand.replace(/\\\r?\n/g, ' ').trim();
  if (!clean.startsWith('curl')) {
    if (clean.startsWith('http')) result.url = clean;
    return result;
  }

  // Method
  const methodMatch = clean.match(/(?:-X|--request)\s+([A-Z]+)/i);
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase();
  }

  // URL
  const urlMatch = clean.match(/(?:'|")?(https?:\/\/[^\s'"]+)(?:'|")?/i);
  if (urlMatch) {
    result.url = urlMatch[1];
  }

  // Headers
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(clean)) !== null) {
    const parts = headerMatch[1].split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      result.headers[key] = val;
    }
  }

  // Data / Body
  const dataMatch = clean.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"]([\s\S]*?)['"](?:\s+-[A-Za-z]|$)/);
  if (dataMatch) {
    result.data = dataMatch[1];
    if (result.method === 'GET') result.method = 'POST';
  }

  // Basic Auth (-u user:pass)
  const authMatch = clean.match(/(?:-u|--user)\s+['"]?([^'"\s]+)['"]?/);
  if (authMatch) {
    result.auth = authMatch[1];
  }

  return result;
}

export interface CurlTarget {
  id: string;
  slug: string;
  name: string;
  language: string;
  library: string;
  description: string;
  seoDescription: string;
  defaultCurl: string;
  generateCode: (parsed: ParsedCurl) => string;
}

export const CURL_TARGETS: CurlTarget[] = [
  {
    id: 'python-requests',
    slug: 'python-requests',
    name: 'Python (requests)',
    language: 'Python',
    library: 'requests',
    description: 'Convert cURL commands to Python using the standard `requests` library. Handles JSON payloads, custom headers, and query parameters.',
    seoDescription: 'Free online cURL to Python converter. Convert any cURL request into idiomatic, copy-paste ready Python requests code.',
    defaultCurl: `curl -X POST https://api.example.com/v1/users \\\n  -H "Authorization: Bearer my_api_key_123" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Jane Doe", "role": "admin"}'`,
    generateCode: (p) => {
      const headersStr = Object.keys(p.headers).length
        ? `headers = {\n${Object.entries(p.headers).map(([k, v]) => `    "${k}": "${v}",`).join('\n')}\n}`
        : 'headers = {}';

      let bodyStr = '';
      if (p.data) {
        try {
          JSON.parse(p.data);
          bodyStr = `json_data = ${p.data}\n`;
        } catch {
          bodyStr = `data = """${p.data}"""\n`;
        }
      }

      const callParam = p.data
        ? (bodyStr.startsWith('json_data') ? ', json=json_data' : ', data=data')
        : '';

      return `import requests\n\nurl = "${p.url}"\n${headersStr}\n${bodyStr}\nresponse = requests.${p.method.toLowerCase()}(url, headers=headers${callParam})\n\nprint("Status:", response.status_code)\nprint("Body:", response.json() if "application/json" in response.headers.get("Content-Type", "") else response.text)`;
    },
  },
  {
    id: 'javascript-fetch',
    slug: 'javascript-fetch',
    name: 'JavaScript (fetch)',
    language: 'JavaScript',
    library: 'Fetch API',
    description: 'Convert cURL to native browser and Node.js 18+ `fetch()` with async/await and JSON response handling.',
    seoDescription: 'Convert cURL to native JavaScript fetch() API. Clean async/await syntax running 100% in your browser.',
    defaultCurl: `curl -X POST https://api.example.com/v1/orders \\\n  -H "Content-Type: application/json" \\\n  -d '{"itemId": "SKU-992", "quantity": 3}'`,
    generateCode: (p) => {
      const options: string[] = [`method: '${p.method}'`];
      if (Object.keys(p.headers).length > 0) {
        options.push(`headers: ${JSON.stringify(p.headers, null, 4)}`);
      }
      if (p.data) {
        try {
          const parsed = JSON.parse(p.data);
          options.push(`body: JSON.stringify(${JSON.stringify(parsed, null, 4)})`);
        } catch {
          options.push(`body: ${JSON.stringify(p.data)}`);
        }
      }

      return `async function makeRequest() {\n  const response = await fetch('${p.url}', {\n    ${options.join(',\n    ')}\n  });\n\n  if (!response.ok) {\n    throw new Error(\`HTTP error! status: \${response.status}\`);\n  }\n\n  const data = await response.json();\n  console.log(data);\n  return data;\n}\n\nmakeRequest().catch(console.error);`;
    },
  },
  {
    id: 'nodejs-axios',
    slug: 'nodejs-axios',
    name: 'Node.js (Axios)',
    language: 'JavaScript / TypeScript',
    library: 'Axios',
    description: 'Convert cURL to Axios HTTP client requests with interceptors, automatic JSON serialization, and error handling.',
    seoDescription: 'Convert cURL commands to Axios in Node.js and React. Generates clean axios() or axios.post() request objects.',
    defaultCurl: `curl -X GET "https://api.example.com/v1/items?limit=10" \\\n  -H "Accept: application/json"`,
    generateCode: (p) => {
      let dataSnippet = '';
      if (p.data) {
        try {
          dataSnippet = `,\n  data: ${JSON.stringify(JSON.parse(p.data), null, 4)}`;
        } catch {
          dataSnippet = `,\n  data: ${JSON.stringify(p.data)}`;
        }
      }

      return `import axios from 'axios';\n\nasync function run() {\n  try {\n    const response = await axios({\n      method: '${p.method.toLowerCase()}',\n      url: '${p.url}',\n      headers: ${JSON.stringify(p.headers, null, 6)}${dataSnippet}\n    });\n    console.log(response.data);\n  } catch (error) {\n    console.error('API Error:', error.response ? error.response.data : error.message);\n  }\n}\n\nrun();`;
    },
  },
  {
    id: 'golang-http',
    slug: 'golang-http',
    name: 'Go (net/http)',
    language: 'Go',
    library: 'net/http',
    description: 'Convert cURL to idiomatic Golang code using standard library `net/http` and `io.ReadAll`.',
    seoDescription: 'Convert cURL commands to Go (Golang) net/http requests with request body buffers and header assignment.',
    defaultCurl: `curl -X POST https://api.example.com/v1/events \\\n  -H "Content-Type: application/json" \\\n  -d '{"event": "signup"}'`,
    generateCode: (p) => {
      const headerLines = Object.entries(p.headers)
        .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
        .join('\n');

      const bodySetup = p.data
        ? `\tbody := strings.NewReader(\`${p.data}\`)\n\treq, err := http.NewRequest("${p.method}", "${p.url}", body)`
        : `\treq, err := http.NewRequest("${p.method}", "${p.url}", nil)`;

      return `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n\t"strings"\n)\n\nfunc main() {\n${bodySetup}\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n${headerLines}\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tresBody, _ := io.ReadAll(resp.Body)\n\tfmt.Println("Status:", resp.Status)\n\tfmt.Println("Body:", string(resBody))\n}`;
    },
  },
  {
    id: 'rust-reqwest',
    slug: 'rust-reqwest',
    name: 'Rust (reqwest)',
    language: 'Rust',
    library: 'reqwest',
    description: 'Convert cURL to Rust using the asynchronous `reqwest` crate and Tokio runtime.',
    seoDescription: 'Convert cURL commands to Rust reqwest asynchronous HTTP requests with JSON and header builders.',
    defaultCurl: `curl -X GET https://api.example.com/v1/metrics \\\n  -H "Authorization: Bearer secret_token"`,
    generateCode: (p) => {
      const headerLines = Object.entries(p.headers)
        .map(([k, v]) => `        .header("${k}", "${v}")`)
        .join('\n');

      const bodyLine = p.data
        ? `\n        .body(r#"${p.data}"#)`
        : '';

      return `use reqwest::Client;\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let client = Client::new();\n    let res = client.${p.method.toLowerCase()}("${p.url}")\n${headerLines}${bodyLine}\n        .send()\n        .await?;\n\n    println!("Status: {}", res.status());\n    let body = res.text().await?;\n    println!("Body: {}", body);\n    Ok(())\n}`;
    },
  },
  {
    id: 'php-guzzle',
    slug: 'php-guzzle',
    name: 'PHP (Guzzle)',
    language: 'PHP',
    library: 'GuzzleHttp',
    description: 'Convert cURL to modern PHP utilizing the Guzzle HTTP client with associative arrays for headers and bodies.',
    seoDescription: 'Convert cURL commands to PHP Guzzle client requests with error handling and JSON decoding.',
    defaultCurl: `curl -X POST https://api.example.com/v1/invoices \\\n  -H "Content-Type: application/json" \\\n  -d '{"amount": 150}'`,
    generateCode: (p) => {
      const headersArr = Object.entries(p.headers)
        .map(([k, v]) => `        '${k}' => '${v}',`)
        .join('\n');

      const bodyOpt = p.data ? `,\n        'body' => '${p.data}'` : '';

      return `<?php\nrequire 'vendor/autoload.php';\n\nuse GuzzleHttp\\Client;\n\n$client = new Client();\n$response = $client->request('${p.method}', '${p.url}', [\n    'headers' => [\n${headersArr}\n    ]${bodyOpt}\n]);\n\necho "Status: " . $response->getStatusCode() . "\\n";\necho "Body: " . $response->getBody()->getContents() . "\\n";`;
    },
  },
  {
    id: 'csharp-httpclient',
    slug: 'csharp-httpclient',
    name: 'C# (.NET HttpClient)',
    language: 'C#',
    library: 'System.Net.Http.HttpClient',
    description: 'Convert cURL commands into modern C# (.NET 6/7/8) using `HttpClient` and `HttpRequestMessage`.',
    seoDescription: 'Convert cURL commands to C# .NET HttpClient code with async/await and StringContent payloads.',
    defaultCurl: `curl -X POST https://api.example.com/v1/webhooks \\\n  -H "Content-Type: application/json" \\\n  -d '{"url": "https://myapp.com/hook"}'`,
    generateCode: (p) => {
      const headerLines = Object.entries(p.headers)
        .filter(([k]) => k.toLowerCase() !== 'content-type')
        .map(([k, v]) => `request.Headers.Add("${k}", "${v}");`)
        .join('\n');

      const contentLine = p.data
        ? `request.Content = new StringContent(@"${p.data.replace(/"/g, '""')}", Encoding.UTF8, "application/json");`
        : '';

      return `using System;\nusing System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\nclass Program\n{\n    static async Task Main()\n    {\n        using var client = new HttpClient();\n        using var request = new HttpRequestMessage(HttpMethod.${p.method === 'POST' ? 'Post' : p.method === 'PUT' ? 'Put' : p.method === 'DELETE' ? 'Delete' : 'Get'}, "${p.url}");\n\n        ${headerLines}\n        ${contentLine}\n\n        var response = await client.SendAsync(request);\n        var body = await response.Content.ReadAsStringAsync();\n        Console.WriteLine($"Status: {response.StatusCode}");\n        Console.WriteLine($"Body: {body}");\n    }\n}`;
    },
  },
  {
    id: 'java-httpclient',
    slug: 'java-httpclient',
    name: 'Java (java.net.http)',
    language: 'Java',
    library: 'java.net.http.HttpClient',
    description: 'Convert cURL into modern Java 11+ standard library `HttpClient` requests without third-party dependencies.',
    seoDescription: 'Convert cURL commands into native Java 11+ HttpClient, HttpRequest, and HttpResponse code.',
    defaultCurl: `curl -X GET https://api.example.com/v1/status`,
    generateCode: (p) => {
      const headerLines = Object.entries(p.headers)
        .map(([k, v]) => `            .header("${k}", "${v}")`)
        .join('\n');

      const bodyPub = p.data
        ? `HttpRequest.BodyPublishers.ofString("${p.data.replace(/"/g, '\\"')}")`
        : 'HttpRequest.BodyPublishers.noBody()';

      return `import java.net.URI;\nimport java.net.http.HttpClient;\nimport java.net.http.HttpRequest;\nimport java.net.http.HttpResponse;\n\npublic class ApiClient {\n    public static void main(String[] args) throws Exception {\n        HttpClient client = HttpClient.newHttpClient();\n        HttpRequest request = HttpRequest.newBuilder()\n            .uri(URI.create("${p.url}"))\n            .method("${p.method}", ${bodyPub})\n${headerLines}\n            .build();\n\n        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n        System.out.println("Status: " + response.statusCode());\n        System.out.println("Body: " + response.body());\n    }\n}`;
    },
  },
  {
    id: 'powershell-rest',
    slug: 'powershell-rest',
    name: 'PowerShell (Invoke-RestMethod)',
    language: 'PowerShell',
    library: 'Invoke-RestMethod',
    description: 'Convert cURL into native Windows PowerShell `Invoke-RestMethod` and `Invoke-WebRequest` command syntax.',
    seoDescription: 'Convert cURL commands to PowerShell Invoke-RestMethod. Automatic JSON parsing for Windows command line scripts.',
    defaultCurl: `curl -X POST https://api.example.com/v1/notify \\\n  -H "Authorization: Bearer token_xyz" \\\n  -d '{"message": "Deploy succeeded"}'`,
    generateCode: (p) => {
      const headersTable = Object.entries(p.headers)
        .map(([k, v]) => `    "${k}" = "${v}"`)
        .join('\n');

      const bodyLine = p.data
        ? `\n$Body = @'\n${p.data}\n'@\n$Response = Invoke-RestMethod -Uri "${p.url}" -Method ${p.method} -Headers $Headers -Body $Body -ContentType "application/json"`
        : `\n$Response = Invoke-RestMethod -Uri "${p.url}" -Method ${p.method} -Headers $Headers`;

      return `$Headers = @{\n${headersTable}\n}${bodyLine}\n\n$Response | ConvertTo-Json`;
    },
  },
  {
    id: 'dart-http',
    slug: 'dart-http',
    name: 'Dart / Flutter (http)',
    language: 'Dart',
    library: 'package:http/http.dart',
    description: 'Convert cURL to Flutter / Dart cross-platform mobile requests using `package:http`.',
    seoDescription: 'Convert cURL commands into Dart and Flutter HTTP requests with headers and async/await.',
    defaultCurl: `curl -X GET https://api.example.com/v1/user/profile \\\n  -H "Authorization: Bearer mobile_jwt"`,
    generateCode: (p) => {
      const headersStr = Object.keys(p.headers).length
        ? `final headers = {\n${Object.entries(p.headers).map(([k, v]) => `    '${k}': '${v}',`).join('\n')}\n  };`
        : 'final headers = <String, String>{};';

      const bodyStr = p.data ? `,\n    body: '${p.data}'` : '';

      return `import 'package:http/http.dart' as http;\n\nFuture<void> makeRequest() async {\n  final url = Uri.parse('${p.url}');\n  ${headersStr}\n\n  final response = await http.${p.method.toLowerCase()}(\n    url,\n    headers: headers${bodyStr},\n  );\n\n  print('Status: \${response.statusCode}');\n  print('Body: \${response.body}');\n}\n\nvoid main() => makeRequest();`;
    },
  },
];

export function getAllCurlTargets(): CurlTarget[] {
  return CURL_TARGETS;
}

export function getCurlTargetBySlug(slug: string): CurlTarget | undefined {
  return CURL_TARGETS.find((t) => t.slug === slug);
}
