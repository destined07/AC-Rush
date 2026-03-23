const LANGUAGE_MAP = {
  'cpp':       { language: 'cpp',    filename: 'main.cpp' },
  'c++':       { language: 'cpp',    filename: 'main.cpp' },
  'cplusplus': { language: 'cpp',    filename: 'main.cpp' },
  'python':    { language: 'python', filename: 'main.py' },
  'python3':   { language: 'python', filename: 'main.py' },
  'java':      { language: 'java',   filename: 'Main.java' }
};

function resolveLanguage(lang) {
  const key = String(lang || '').toLowerCase().trim();
  const mapped = LANGUAGE_MAP[key];
  if (!mapped) throw new Error(`Unsupported language: ${lang}`);
  return mapped;
}

export async function executeCodeOneCompiler(sourceCode, language, stdin = '') {
  const { language: lang, filename } = resolveLanguage(language);

  const startTime = Date.now();

  const response = await fetch('https://api.onecompiler.com/v1/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.ONECOMPILER_KEY
    },
    body: JSON.stringify({
      language: lang,
      stdin: stdin || '',
      files: [
        {
          name: filename,
          content: sourceCode
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OneCompiler API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(3);

  let status = 'Accepted';
  let output = '';
  let error = '';

  if (data.stderr && data.stderr.trim()) {
    if (!data.stdout || !data.stdout.trim()) {
      status = 'Compilation Error';
    } else {
      status = 'Accepted';
    }
    error = data.stderr;
  }

  if (data.exception) {
    status = 'Runtime Error';
    error = data.exception;
  }

  if (data.stdout) {
    output = data.stdout;
  }

  if (data.status === 'success' && !data.exception && !error) {
    status = 'Accepted';
  }

  return {
    status,
    output,
    error,
    executionTime: Number(elapsed),
    memory: 0
  };
}
