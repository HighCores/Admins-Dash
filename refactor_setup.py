import os

REPLACEMENTS = {
    "setup/page.tsx": [
        ('Operational Channels', 'System Channels'),
        ('Specific Log Nodes', 'Specific Log Channels'),
        ('Settings synchronized!', 'Settings saved!'),
        ('Logic defaults injected!', 'Command defaults loaded!'),
        ('Subsystem // Global Configuration Hub', 'Management // System Configuration Hub'),
        ('Calibrating global architectural parameters, communication relays, and authority nodes', 'Configuring system parameters, communication channels, and staff roles'),
        ('Config Layer', 'System Configuration'),
        ('AUTHORIZED', 'VERIFIED'),
        ('Shard 1: Infrastructure', 'Part 1: Infrastructure'),
        ('Shard 2: Authority & Operations', 'Part 2: Authority & Operations'),
        ('Member Activity (Join/Leave)', 'Member Engagement (Join/Leave)'),
        ('Message Analysis', 'Message Logs'),
        ('Support History', 'Support Logs'),
        ('Administrative Audit', 'Staff Activity Logs'),
        ('Security Alerts', 'Security Logs'),
        ('Sync Status', 'System Status'),
        ('Node Link', 'Connection Status'),
        ('OPTIMAL', 'ONLINE'),
        ('SEVERED', 'OFFLINE'),
        ('DB Latency', 'System Latency'),
        ('Load System Defaults', 'Load Initial Defaults'),
        ('RESET_CMD_NODES', 'RESET_COMMANDS'),
        ('TERMINATE SESSION', 'LOGOUT SESSION')
    ]
}

base_path = r"c:\Users\omars\Downloads\highcore-dashboard\src\app\dashboard\discord"

for file_rel, pairs in REPLACEMENTS.items():
    file_path = os.path.join(base_path, file_rel)
    if not os.path.exists(file_path):
        print(f"Skipping {file_rel} (Not found)")
        continue
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = content
    for old, new in pairs:
        new_content = new_content.replace(old, new)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Humanized {file_rel}")
    else:
        print(f"No changes needed for {file_rel}")
