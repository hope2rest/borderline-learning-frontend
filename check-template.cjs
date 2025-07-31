const fs = require('fs');

const content = fs.readFileSync('/Users/rm/spark/borderline-learning-frontend/src/views/TeacherMainPage.vue', 'utf8');

// Extract template section
const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
if (!templateMatch) {
  console.log('No template section found!');
  process.exit(1);
}

const template = templateMatch[1];
const lines = template.split('\n');

// Track opening and closing tags
const tagStack = [];
const problems = [];

lines.forEach((line, index) => {
  const lineNumber = index + 2; // +2 because template starts at line 2
  
  // Find all tags in this line
  const tags = line.match(/<\/?[^>]+>/g) || [];
  
  tags.forEach(tag => {
    if (tag.startsWith('</')) {
      // Closing tag
      const tagName = tag.slice(2, -1).split(' ')[0];
      
      if (tagStack.length > 0 && tagStack[tagStack.length - 1].name === tagName) {
        tagStack.pop();
      } else {
        problems.push(`Line ${lineNumber}: Unexpected closing tag ${tag}, expected ${tagStack.length > 0 ? '</' + tagStack[tagStack.length - 1].name + '>' : 'no tag'}`);
      }
    } else if (!tag.endsWith('/>') && !tag.includes('/>')) {
      // Opening tag (not self-closing)
      const tagMatch = tag.match(/<([a-zA-Z][^\s>/]*)/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        // Skip void elements that don't need closing tags
        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'path', 'polyline', 'line', 'circle', 'rect', 'ellipse', 'polygon', 'source', 'track', 'wbr'];
        
        if (!voidElements.includes(tagName.toLowerCase())) {
          tagStack.push({name: tagName, line: lineNumber});
        }
      }
    }
  });
});

if (problems.length > 0) {
  console.log('Problems found:');
  problems.forEach(problem => console.log(problem));
}

if (tagStack.length > 0) {
  console.log('\nUnclosed tags:');
  tagStack.forEach(tag => console.log(`Line ${tag.line}: <${tag.name}> is not closed`));
}

if (problems.length === 0 && tagStack.length === 0) {
  console.log('Template structure looks correct!');
}