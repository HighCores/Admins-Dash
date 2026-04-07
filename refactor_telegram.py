import os

REPLACEMENTS = {
    "welcome/page.tsx": [
        ('Subsystem // Neural Engagement Handshake', 'Management // Member Engagement System'),
        ('Welcome Protocols', 'Welcome Messages'),
        ('identified entities entering the Highcore relay', 'new members joining the Highcore Hub'),
        ('ACTIVE_SYNC', 'SYSTEM_ACTIVE'),
        ('SYNC_SEVERED', 'SYSTEM_OFFLINE'),
        ('PROTOCOL_PAUSED', 'SYSTEM_PAUSED'),
        ('GREETING_TARGET_NODE', 'TARGET_CHANNEL'),
        ('PLAIN_TEXT_DATA', 'PLAIN_TEXT'),
        ('NEURAL_EMBED_FLOW', 'MODERN_EMBED'),
        ('Neural Accent', 'Color Accent'),
        ('Asset Pointer', 'Avatar Image'),
        ('Neural Payload', 'Message Content'),
        ('TRANSMIT_GREETING_HERE...', 'ENTER_WELCOME_MESSAGE...'),
        ('Sync_Handshake', 'Sync_Settings'),
        ('Handshake logic synchronized!', 'Welcome settings saved!'),
        ('A NEW_ENTITY HAS APPROACHED', 'WELCOME TO THE FAMILY')
    ],
    "tickets/page.tsx": [
        ('Subsystem // Incident Logs', 'Management // Support Logs'),
        ('Operational Tickets', 'Support Tickets'),
        ('Highcore Relay', 'Highcore Support System'),
        ('Scan Node, User or ID...', 'Search Ticket, User or ID...'),
        ('REGISTRY', 'RECORDS'),
        ('No logs manifest.', 'No tickets found.'),
        ('SECURE_NODE_#', 'TICKET_#'),
        ('SESSION_LOG', 'SUPPORT_LOG'),
        ('Affiliate Identity', 'User Identity'),
        ('Core Subject', 'Support Subject'),
        ('Decrypting Operational Streams...', 'Loading Support History...'),
        ('No Trace Manifest', 'No Messages'),
        ('Zero Telemetry Inbound', 'The message history is empty'),
        ('Unknown_Node', 'Unknown_User'),
        ('SYSTEM_COMMS', 'SYSTEM_MSG'),
        ('DOWNLOAD_PROTOCOL_AUDIT', 'DOWNLOAD_TRANSCRIPT'),
        ('SYNC_WITH_SECURE_CHANNEL', 'SYNC_WITH_TELEGRAM'),
        ('Establish a node connection to verify interaction telemetry', 'Select a ticket to view the interaction history'),
        ('Data Stream Payload', 'Message Content'),
        ('Node:', 'User:')
    ],
    "admin-points/page.tsx": [
        ('High Command Performance Registry', 'Staff Performance Record'),
        ('operator efficiency and neural response protocols', 'staff efficiency and response guidelines'),
        ('ACTIONS_CAPTURED', 'ACTIONS_LOGGED'),
        ('No operations manifest', 'No staff activity found'),
        ('OPERATIONAL_STABLE', 'STAFF_ONLINE'),
        ('Operational Audit', 'Activity Audit'),
        ('NODE_AUDIT_STABLE', 'ACTIVITY_LOGGED'),
        ('ACTS', 'POINTS'),
        ('Inspect Performance Logs', 'View Activity Logs'),
        ('Merit Mutation', 'Performance Bonus'),
        ('bonus High Core Nodes', 'bonus points'),
        ('REWARD_ELITE_NODE', 'REWARD_TOP_STAFF'),
        ('NODE_UNKNOWN', 'USER_UNKNOWN')
    ],
    "auto-replies/page.tsx": [
        ('Subsystem // Neural Auto-Response Relay', 'Management // Automated Support System'),
        ('Trigger Matrix', 'Keywords/Triggers'),
        ('identified stimulus', 'matched keywords'),
        ('Registry', 'System'),
        ('Logic Matrix', 'Trigger Logic'),
        ('Add Stimulus', 'Add Keyword'),
        ('Payload Response', 'Automated Response'),
        ('Stimulus Trigger', 'Keyword Trigger'),
        ('Neural Payload', 'Message Content'),
        ('STIMULUS_VOID', 'NO_KEYWORDS'),
        ('Recalibrate Stimulus', 'Edit Keyword'),
        ('Neural Sync', 'Save Settings'),
        ('Logic node stabilized!', 'Trigger saved!')
    ],
    "commands/page.tsx": [
        ('Neural Logic Overlord', 'System Command Management'),
        ('Logic Nodes', 'Custom Commands'),
        ('Distribution and neural pathways', 'distribution and system triggers'),
        ('Scan neural paths...', 'Search commands...'),
        ('Inject Path', 'Add Command'),
        ('Logic node', 'Command'),
        ('Neural Path', 'Command Trigger'),
        ('Automated Payload', 'Automated Response'),
        ('Logic node stabilized!', 'Command saved!'),
        ('ERR_LOGIC', 'ERR_SYSTEM'),
        ('Logic Void Detected', 'No Commands Found'),
        ('CORE_RELAY', 'ACTIVE'),
        ('Neural Pulse', 'Command Statistics'),
        ('Activity Trace', 'Action History'),
        ('Telemetry Active', 'Monitoring Active'),
        ('Performance Ledger', 'Action Logs'),
        ('Neural Calibrator', 'Command Editor'),
        ('Relay Status', 'Active Status'),
        ('SEVERED', 'DISABLED'),
        ('Neural Action Type', 'Action Type'),
        ('Neural Panel', 'Selection Menu'),
        ('Color Matrix', 'Color Picker'),
        ('Broadcast Neural Sync', 'Save Command')
    ],
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

base_path = r"c:\Users\omars\Downloads\highcore-dashboard\src\app\dashboard\telegram"

for file_rel, pairs in REPLACEMENTS.items():
    file_path = os.path.join(base_path, file_rel)
    if not os.path.exists(file_path):
        # Check for folders if page.tsx is inside
        dir_path = os.path.join(base_path, file_rel.replace("/page.tsx", ""))
        if os.path.isdir(dir_path):
             file_path = os.path.join(dir_path, "page.tsx")
        
    if not os.path.exists(file_path):
        print(f"Skipping {file_rel} (Not found at {file_path})")
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
