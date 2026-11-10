import fs from 'fs';

const logPath = 'C:/Users/Kartik/.gemini/antigravity/brain/05c25442-a8c6-479b-be93-f1c90d4df1f9/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  const obj = JSON.parse(line);
  if (obj.step_index === 1852) {
    console.log('Found step 1852. Keys:', Object.keys(obj));
    const content = obj.content || obj.text || (obj.message && obj.message.content);
    if (typeof content === 'string') {
      fs.writeFileSync('content/website-content.md', content, 'utf8');
      console.log('Successfully wrote content/website-content.md, length:', content.length);
    } else {
      console.log('Content is not string:', typeof content, content);
    }
    break;
  }
}

