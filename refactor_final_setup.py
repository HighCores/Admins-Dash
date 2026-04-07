import os

REPLACEMENTS = [
    ('Subsystem // Global Configuration Hub', 'Management // Global Configuration Hub'),
    ('Calibrating global architectural parameters, communication relays, and authority nodes', 'Configuring system parameters, communication channels, and staff roles'),
    ('Logic defaults injected!', 'Initial defaults loaded!'),
    ('Config Layer', 'System Configuration'),
    ('Global Channels', 'Part 1: Primary Infrastructure'),
    ('Standard Roles', 'Part 2: Staff Roles'),
    ('Security Alerts', 'Security Events'),
    ('Node Link', 'Connection Link'),
    ('OPTIMAL', 'ONLINE'),
    ('SEVERED', 'OFFLINE'),
    ('DB Latency', 'System Latency'),
    ('Load System Defaults', 'Load Initial Defaults'),
    ('RESET_CMD_NODES', 'RESET_COMMANDS'),
    ('TERMINATE SESSION', 'LOGOUT SESSION'),
    ('Settings synchronized!', 'Settings saved!')
]

files = [
    r"c:\Users\omars\Downloads\highcore-dashboard\src\app\dashboard\discord\setup\page.tsx",
    r"c:\Users\omars\Downloads\highcore-dashboard\src\app\dashboard\telegram\setup\page.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (Not found)")
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    for old, new in REPLACEMENTS:
        new_content = new_content.replace(old, new)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Humanized {os.path.basename(os.path.dirname(file_path))}/setup")
    else:
        print(f"No changes needed for {os.path.basename(os.path.dirname(file_path))}/setup")
