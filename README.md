# HighCore Bots Dashboard

A unified control panel designed to streamline the administration of HighCore's Discord and Telegram ecosystems. The dashboard provides full oversight over automation logic, client interactions, and system telemetry across all integrated platforms.

## Overview

HighCore Bots Dashboard is built to centralize operational workflows. Rather than managing bots individually, the system bridges Discord and Telegram backends to a single web interface, allowing for synchronized control and monitoring. 

It handles direct database interactions via Supabase to ensure data persistence, while leveraging dedicated API routes to trigger events directly on the respective bot servers.

### Core Modules

* Authentication and Access Control: Restricted access enforced through Discord OAuth2. Only authorized staff members can initialize a session.
* Broadcast System: Facilitates targeted or massive message dispatching to either Discord or Telegram platforms simultaneously. 
* Order and Ticket Management: Provides a real-time, consolidated view of all open requests, invoices, and active support tickets. Includes capabilities for transcript reviewing and status manipulation.
* Automation Control: Interface to define, edit, and remove auto-responses dynamically across the network.
* System Telemetry: An audit log mechanism that tracks all administrative actions taken within the dashboard for accountability.

## Architecture

The project relies on a Next.js framework operating alongside Tailwind CSS for the user interface. It connects directly to:
1. Supabase PostgreSQL: Primary data store for orders, tickets, responses, and audit logs.
2. Discord and Telegram Bot APIs: Standalone REST APIs hosted by the bot applications for executing real-time broadcast and moderation commands.

## Environment Configuration

Configuration is managed via standard environment variables. Refer to the `.env.example` file for the required keys, which include Supabase credentials, Discord OAuth logic, and REST API routing for the bots.