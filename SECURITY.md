# Security Policy

## Security Considerations

### API Key Security

The current implementation of this project uses OpenAI API directly in the frontend, which is not secure for production use. Here's why:

1. **Exposed API Key**: The API key is visible in the frontend code and can be easily extracted by users.
2. **No Rate Limiting**: There's no control over API usage, which could lead to abuse.
3. **No Authentication**: Anyone can use your API key without proper authentication.

### Recommended Security Measures

#### 1. Backend Implementation

Create a backend service to handle API calls:

```typescript
// backend/src/services/openai.ts
import OpenAI from 'openai'
import { rateLimit } from 'express-rate-limit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

// API endpoint
app.post('/api/chat', limiter, async (req, res) => {
  try {
    const { messages, tools } = req.body
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      tools,
      tool_choice: 'auto',
      stream: true,
    })
    res.json(completion)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

#### 2. Environment Variables

Store sensitive information in environment variables:

```env
# .env
OPENAI_API_KEY=your_api_key_here
API_RATE_LIMIT=100
API_WINDOW_MS=900000
```

#### 3. Authentication

Implement user authentication:

```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}
```

#### 4. API Key Rotation

Implement API key rotation:

```typescript
// backend/src/services/keyRotation.ts
import { OpenAI } from 'openai'

class KeyRotation {
  private keys: string[]
  private currentIndex: number = 0

  constructor(keys: string[]) {
    this.keys = keys
  }

  getNextKey(): string {
    const key = this.keys[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.keys.length
    return key
  }
}

const keyRotation = new KeyRotation([
  process.env.OPENAI_API_KEY_1,
  process.env.OPENAI_API_KEY_2,
  process.env.OPENAI_API_KEY_3,
])
```

### Frontend Security

1. **Input Validation**: Validate all user inputs before sending to the backend.
2. **XSS Prevention**: Use proper escaping and sanitization.
3. **CSRF Protection**: Implement CSRF tokens for API requests.
4. **Secure Storage**: Use secure storage methods for sensitive data.

### Monitoring and Logging

Implement proper monitoring and logging:

```typescript
// backend/src/middleware/logging.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

export const logRequest = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  })
  next()
}
```

## Reporting Security Issues

If you discover a security vulnerability, please:

1. Do not disclose the issue publicly
2. Send a detailed report to [your-email@example.com]
3. Include steps to reproduce the issue
4. Provide any relevant code snippets or logs

## Security Updates

We regularly update our dependencies and security measures. Please keep your installation up to date:

```bash
pnpm update
```

## Additional Resources

- [OpenAI Security Best Practices](https://platform.openai.com/docs/guides/security)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Vue.js Security Guide](https://vuejs.org/guide/best-practices/security.html)
