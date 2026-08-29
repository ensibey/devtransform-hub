export type FormatId =
  | 'json'
  | 'yaml'
  | 'csv'
  | 'xml'
  | 'toml'
  | 'typescript'
  | 'go'
  | 'rust'
  | 'python'
  | 'sql';

export interface FormatMetadata {
  id: FormatId;
  name: string;
  shortName: string;
  category: 'data' | 'types' | 'query';
  extension: string;
  mimeType: string;
  description: string;
  sample: string;
  syntaxLanguage: string; // for CodeMirror
  supportsBeautify: boolean;
  supportsMinify: boolean;
  canBeSource: boolean;
  canBeTarget: boolean;
  keywords: string[];
}

export const FORMATS: Record<FormatId, FormatMetadata> = {
  json: {
    id: 'json',
    name: 'JSON (JavaScript Object Notation)',
    shortName: 'JSON',
    category: 'data',
    extension: 'json',
    mimeType: 'application/json',
    description: 'Standard lightweight data-interchange format with broad language support.',
    syntaxLanguage: 'json',
    supportsBeautify: true,
    supportsMinify: true,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['json', 'javascript object notation', 'api', 'payload', 'schema'],
    sample: `{
  "id": "usr_99812",
  "name": "Sarah Connor",
  "email": "sarah.connor@cyberdyne.io",
  "isActive": true,
  "age": 34,
  "roles": ["admin", "developer", "auditor"],
  "preferences": {
    "theme": "oled-dark",
    "notifications": {
      "email": true,
      "sms": false,
      "frequency": "daily"
    }
  },
  "metrics": {
    "loginCount": 142,
    "lastLatencyMs": 4.12
  }
}`,
  },
  yaml: {
    id: 'yaml',
    name: 'YAML (YAML Ain\'t Markup Language)',
    shortName: 'YAML',
    category: 'data',
    extension: 'yaml',
    mimeType: 'text/yaml',
    description: 'Human-friendly data serialization standard commonly used in configuration and CI/CD pipelines.',
    syntaxLanguage: 'yaml',
    supportsBeautify: true,
    supportsMinify: false,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['yaml', 'yml', 'k8s', 'kubernetes', 'docker-compose', 'ci/cd'],
    sample: `id: usr_99812
name: Sarah Connor
email: sarah.connor@cyberdyne.io
isActive: true
age: 34
roles:
  - admin
  - developer
  - auditor
preferences:
  theme: oled-dark
  notifications:
    email: true
    sms: false
    frequency: daily
metrics:
  loginCount: 142
  lastLatencyMs: 4.12
`,
  },
  csv: {
    id: 'csv',
    name: 'CSV (Comma Separated Values)',
    shortName: 'CSV',
    category: 'data',
    extension: 'csv',
    mimeType: 'text/csv',
    description: 'Tabular data representation standard for spreadsheets, relational databases, and data analysis.',
    syntaxLanguage: 'javascript',
    supportsBeautify: true,
    supportsMinify: true,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['csv', 'excel', 'spreadsheet', 'tabular', 'tsv', 'table'],
    sample: `id,name,email,isActive,age,role
usr_101,Sarah Connor,sarah@example.com,true,34,admin
usr_102,John Doe,john@example.com,false,28,developer
usr_103,Alex Rivera,alex@example.com,true,41,auditor
`,
  },
  xml: {
    id: 'xml',
    name: 'XML (Extensible Markup Language)',
    shortName: 'XML',
    category: 'data',
    extension: 'xml',
    mimeType: 'application/xml',
    description: 'Hierarchical markup language for structured data, SOAP web services, and enterprise integration.',
    syntaxLanguage: 'xml',
    supportsBeautify: true,
    supportsMinify: true,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['xml', 'markup', 'soap', 'rss', 'svg', 'xpath'],
    sample: `<?xml version="1.0" encoding="UTF-8"?>
<user id="usr_99812">
  <name>Sarah Connor</name>
  <email>sarah.connor@cyberdyne.io</email>
  <isActive>true</isActive>
  <age>34</age>
  <roles>
    <role>admin</role>
    <role>developer</role>
    <role>auditor</role>
  </roles>
  <preferences>
    <theme>oled-dark</theme>
    <notifications email="true" sms="false" frequency="daily"/>
  </preferences>
  <metrics loginCount="142" lastLatencyMs="4.12"/>
</user>`,
  },
  toml: {
    id: 'toml',
    name: 'TOML (Tom\'s Obvious Minimal Language)',
    shortName: 'TOML',
    category: 'data',
    extension: 'toml',
    mimeType: 'text/x-toml',
    description: 'Minimal configuration file format designed to be easy to read due to obvious semantics (used in Rust Cargo, Python pyproject, etc.).',
    syntaxLanguage: 'yaml',
    supportsBeautify: true,
    supportsMinify: false,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['toml', 'cargo', 'pyproject', 'config', 'ini'],
    sample: `id = "usr_99812"
name = "Sarah Connor"
email = "sarah.connor@cyberdyne.io"
isActive = true
age = 34
roles = ["admin", "developer", "auditor"]

[preferences]
theme = "oled-dark"

[preferences.notifications]
email = true
sms = false
frequency = "daily"

[metrics]
loginCount = 142
lastLatencyMs = 4.12
`,
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript (Interfaces / Types)',
    shortName: 'TypeScript',
    category: 'types',
    extension: 'ts',
    mimeType: 'text/typescript',
    description: 'Strongly typed JavaScript interfaces, type aliases, and discriminated unions.',
    syntaxLanguage: 'javascript',
    supportsBeautify: true,
    supportsMinify: false,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['typescript', 'ts', 'interface', 'type', 'types', 'generics'],
    sample: `export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  age: number;
  roles: string[];
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      sms: boolean;
      frequency: string;
    };
  };
  metrics: {
    loginCount: number;
    lastLatencyMs: number;
  };
}`,
  },
  go: {
    id: 'go',
    name: 'Go (Golang Structs)',
    shortName: 'Go',
    category: 'types',
    extension: 'go',
    mimeType: 'text/x-go',
    description: 'Golang struct definitions complete with JSON, YAML, and BSON struct field tags.',
    syntaxLanguage: 'rust',
    supportsBeautify: true,
    supportsMinify: false,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['golang', 'go', 'struct', 'json tag', 'marshal', 'unmarshal'],
    sample: `package main

type UserProfile struct {
	ID          string      \`json:"id"\`
	Name        string      \`json:"name"\`
	Email       string      \`json:"email"\`
	IsActive    bool        \`json:"isActive"\`
	Age         int64       \`json:"age"\`
	Roles       []string    \`json:"roles"\`
	Preferences Preferences \`json:"preferences"\`
	Metrics     Metrics     \`json:"metrics"\`
}

type Metrics struct {
	LoginCount    int64   \`json:"loginCount"\`
	LastLatencyMs float64 \`json:"lastLatencyMs"\`
}

type Preferences struct {
	Theme         string        \`json:"theme"\`
	Notifications Notifications \`json:"notifications"\`
}

type Notifications struct {
	Email     bool   \`json:"email"\`
	SMS       bool   \`json:"sms"\`
	Frequency string \`json:"frequency"\`
}`,
  },
  rust: {
    id: 'rust',
    name: 'Rust (Serde Structs)',
    shortName: 'Rust',
    category: 'types',
    extension: 'rs',
    mimeType: 'text/x-rust',
    description: 'Rust structs with derive macros: Serialize, Deserialize, Debug, Clone, and rename tags.',
    syntaxLanguage: 'rust',
    supportsBeautify: true,
    supportsMinify: false,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['rust', 'serde', 'struct', 'derive', 'cargo', 'tokio'],
    sample: `use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub email: String,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    pub age: i64,
    pub roles: Vec<String>,
    pub preferences: Preferences,
    pub metrics: Metrics,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Metrics {
    #[serde(rename = "loginCount")]
    pub login_count: i64,
    #[serde(rename = "lastLatencyMs")]
    pub last_latency_ms: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Preferences {
    pub theme: String,
    pub notifications: Notifications,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Notifications {
    pub email: bool,
    pub sms: bool,
    pub frequency: String,
}`,
  },
  python: {
    id: 'python',
    name: 'Python (Pydantic / Dataclass)',
    shortName: 'Python',
    category: 'types',
    extension: 'py',
    mimeType: 'text/x-python',
    description: 'Python type definitions supporting Pydantic BaseModel, Field aliases, and @dataclass.',
    syntaxLanguage: 'python',
    supportsBeautify: true,
    supportsMinify: false,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['python', 'pydantic', 'dataclass', 'typing', 'fastapi'],
    sample: `from typing import List, Optional
from pydantic import BaseModel, Field

class Notifications(BaseModel):
    email: bool
    sms: bool
    frequency: str

class Preferences(BaseModel):
    theme: str
    notifications: Notifications

class Metrics(BaseModel):
    login_count: int = Field(alias="loginCount")
    last_latency_ms: float = Field(alias="lastLatencyMs")

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    is_active: bool = Field(alias="isActive")
    age: int
    roles: List[str]
    preferences: Preferences
    metrics: Metrics
`,
  },
  sql: {
    id: 'sql',
    name: 'SQL (DDL Schema & Inserts)',
    shortName: 'SQL',
    category: 'query',
    extension: 'sql',
    mimeType: 'application/sql',
    description: 'Relational database schema definition (CREATE TABLE DDL) and INSERT statements.',
    syntaxLanguage: 'sql',
    supportsBeautify: true,
    supportsMinify: true,
    canBeSource: true,
    canBeTarget: true,
    keywords: ['sql', 'ddl', 'schema', 'postgres', 'mysql', 'sqlite', 'create table'],
    sample: `CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  age INTEGER,
  theme VARCHAR(50) DEFAULT 'oled-dark',
  login_count INTEGER DEFAULT 0,
  last_latency_ms NUMERIC(8, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, is_active, age, theme, login_count, last_latency_ms)
VALUES ('usr_99812', 'Sarah Connor', 'sarah.connor@cyberdyne.io', true, 34, 'oled-dark', 142, 4.12);
`,
  },
};

export const FORMAT_LIST = Object.values(FORMATS);

export interface MatrixPair {
  from: FormatId;
  to: FormatId;
  fromMeta: FormatMetadata;
  toMeta: FormatMetadata;
  title: string;
  slug: string;
  category: 'data-to-data' | 'data-to-type' | 'type-to-data' | 'query';
}

/**
 * Returns all N * (N - 1) = 90 static conversion pairs.
 */
export function getAllMatrixPairs(): MatrixPair[] {
  const pairs: MatrixPair[] = [];
  const keys = Object.keys(FORMATS) as FormatId[];

  for (const from of keys) {
    for (const to of keys) {
      if (from === to) continue;
      const fromMeta = FORMATS[from];
      const toMeta = FORMATS[to];

      let category: MatrixPair['category'] = 'data-to-data';
      if (fromMeta.category === 'data' && toMeta.category === 'types') {
        category = 'data-to-type';
      } else if (fromMeta.category === 'types' && toMeta.category === 'data') {
        category = 'type-to-data';
      } else if (fromMeta.category === 'query' || toMeta.category === 'query') {
        category = 'query';
      }

      pairs.push({
        from,
        to,
        fromMeta,
        toMeta,
        title: `${fromMeta.shortName} to ${toMeta.shortName} Converter`,
        slug: `${from}-to-${to}`,
        category,
      });
    }
  }

  return pairs;
}

export function isValidFormatId(id: string): id is FormatId {
  return id in FORMATS;
}

export function getMatrixPair(from: string, to: string): MatrixPair | null {
  if (!isValidFormatId(from) || !isValidFormatId(to) || from === to) {
    return null;
  }
  const fromMeta = FORMATS[from];
  const toMeta = FORMATS[to];

  let category: MatrixPair['category'] = 'data-to-data';
  if (fromMeta.category === 'data' && toMeta.category === 'types') {
    category = 'data-to-type';
  } else if (fromMeta.category === 'types' && toMeta.category === 'data') {
    category = 'type-to-data';
  } else if (fromMeta.category === 'query' || toMeta.category === 'query') {
    category = 'query';
  }

  return {
    from,
    to,
    fromMeta,
    toMeta,
    title: `${fromMeta.shortName} to ${toMeta.shortName} Converter`,
    slug: `${from}-to-${to}`,
    category,
  };
}
