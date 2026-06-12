import os, glob

files = glob.glob('frontend/src/**/*.js', recursive=True)
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'alert(' in content:
        # Replace alert( with toast.info(
        content = content.replace('alert(', 'toast.info(')
        
        # We need to import toast if it is not imported
        if 'import { toast }' not in content:
            # Find the last import
            lines = content.split('\n')
            last_import_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import_idx = i
            
            lines.insert(last_import_idx + 1, "import { toast } from 'react-toastify'")
            content = '\n'.join(lines)
            
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1

print(f'Replaced alerts in {count} files')
