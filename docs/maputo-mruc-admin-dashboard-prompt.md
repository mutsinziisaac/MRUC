# Maputo MRUC Government Admin Dashboard Prototype Implementation Prompt

Build a realistic, high-fidelity government admin dashboard prototype for the Maputo Unified Road Revenue ecosystem. This is a prototype UI only, not a production backend integration. The dashboard should help government stakeholders understand the performance, financial effectiveness, compliance posture, and operational health of the Unified Road User Charge and Toll Management System. It should feel like a serious civic-grade internal platform used by the Governor's office, municipal finance leadership, transport administrators, and system oversight teams.

Use the existing stack in this repository:

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui primitives already configured in the repo
- lucide-react for icons

Replace the starter screen entirely and build a multi-page prototype with realistic mock data and a polished modern UI.

## Product Goal

Create the government-side admin experience for monitoring whether the MRUC system is working well, collecting revenue efficiently, reducing leakage, improving compliance, and staying operationally healthy. The prototype should make it easy for a government user to answer questions like:

- How much revenue has been collected today, this week, this month, and year to date?
- Are collections meeting targets across corridors, toll points, and payment channels?
- Where are leakages, anomalies, or enforcement issues happening?
- Is the system operationally stable and trusted?
- Which policy settings, tariffs, exemptions, and alert thresholds are currently active?
- What recent actions, incidents, or changes need government attention?

## Audience

Design primarily for:

- Governor / executive oversight users
- Municipal finance officers
- Transport and road revenue administrators
- Enforcement oversight staff
- System administrators with limited configuration responsibility

The product must feel official, efficient, and clear under pressure. It should not feel like a startup SaaS template.

## Scope

The prototype is analytics-first with light configuration.

Include:

- Performance dashboards
- Revenue and collection insights
- Compliance and enforcement insights
- Operational effectiveness and system health
- Alerts, audit visibility, and recent actions
- Limited government-facing configuration screens

Do not include:

- Authentication flows
- Real backend integration
- CRUD-heavy management consoles
- Full case management
- Full user administration suite
- Complex workflow engines
- Editable transactional tables that imply real production state changes

## Experience Direction

Build this as a realistic multi-page admin application with:

- A left sidebar for top-level navigation
- A top bar with current system status, date-range controls, search/command entry, and quick filters
- Distinct screens routed or simulated as separate views
- Rich mock data that feels plausible for a municipality-scale road revenue system in Maputo
- Executive-summary readability with enough density for operational review

The UI should be desktop-first but fully responsive down to tablet and mobile. On smaller screens, preserve hierarchy and readability rather than forcing desktop density.

## Visual Theme

Use a strong modern civic-enterprise visual language.

Theme requirements:

- Serious, premium, government-grade look
- Clean, structured, intuitive layout
- Not generic, not purple-heavy, not neon, not overly futuristic
- Use a refined palette inspired by infrastructure, finance, and public administration
- Suggested palette direction: deep teal, slate, sand, muted gold, fog white, restrained signal colors for alerts
- Strong contrast and information hierarchy
- Cards should feel substantial, not lightweight consumer widgets
- Use purposeful typography and spacing to create confidence and clarity

Typography guidance:

- Use the existing font stack unless you intentionally introduce a better display pairing
- Establish a stronger heading voice than the default starter styling
- Use clear numerical emphasis for revenue, percentages, and status metrics

Motion guidance:

- Use subtle page-load transitions and staggered chart/card reveals
- Avoid decorative animation loops
- Motion should support orientation, not distract

## Information Architecture

Create these primary navigation items:

1. Overview
2. Revenue Analytics
3. Compliance & Enforcement
4. Operations Health
5. Government Configuration
6. Alerts & Audit Trail

You may add one secondary item if it improves realism, but keep the product focused.

## Required Screens

### 1. Overview

This is the executive landing screen. It should summarize the whole system at a glance.

Include:

- Hero KPI band with:
  - Total revenue collected today
  - Month-to-date revenue
  - Collection efficiency
  - Compliance rate
  - System uptime
  - Open high-priority alerts
- Revenue vs target trend chart
- Corridor or district performance comparison
- Payment channel mix
- Top-performing and underperforming collection points
- Key alerts panel
- Recent government-relevant actions or changes
- A short effectiveness summary module that explains whether the system is improving performance and where intervention is needed

### 2. Revenue Analytics

This screen should go deeper into financial performance.

Include:

- Time-series charts for daily, weekly, monthly, and YTD collections
- Actual vs target comparison by corridor, toll station, or district
- Breakdown by revenue stream
- Breakdown by payment channel:
  - Mobile money
  - Card
  - Bank transfer
  - Cash where applicable
- Average transaction value
- Collection throughput by hour/day
- Leakage risk or unexplained variance module
- Forecast panel for expected month-end outcome
- Filter controls for date range, corridor, payment channel, and district

### 3. Compliance & Enforcement

This screen should communicate whether the system is effective at reducing evasion and improving charge compliance.

Include:

- Compliance rate trend
- Violations detected
- Resolved vs unresolved enforcement issues
- Evasion hotspots or corridor heatmap
- Vehicle/checkpoint inspection effectiveness
- Enforcement team performance summaries
- Exemption usage overview
- Policy breach or suspicious activity cards
- Priority action list for areas with declining compliance

Make this screen feel operational and strategic, not punitive or visually chaotic.

### 4. Operations Health

This screen should reflect system stability and operational effectiveness.

Include:

- Overall uptime
- Availability by service/component
- Transaction success rate
- Average processing latency
- Device/checkpoint connectivity health
- Incident count and severity
- Response and resolution time
- Live status board for major operational zones
- Maintenance or outage history
- Reliability trend line

Frame this as government oversight of infrastructure performance, not as a raw engineering dashboard.

### 5. Government Configuration

This must be a limited, thoughtful configuration surface with view-first patterns and safe editing cues.

Include modules for:

- Tariff bands and charge categories
- Exemptions and special classes
- Alert thresholds
- Enforcement policy settings
- Payment channel availability toggles
- Reporting cadence / executive report preferences
- Role-based access overview

Important:

- Do not design this as a dense form dump
- Use cards, sections, summaries, and confirmation-oriented layouts
- Show current active policy state clearly
- Include last updated metadata and who changed what
- Make it feel safe, governed, and auditable

### 6. Alerts & Audit Trail

This screen should help oversight users see what changed and what needs intervention.

Include:

- Alert inbox with severity filters
- Incident categories
- Recent configuration changes
- Audit timeline
- Acknowledged vs unresolved alerts
- Linked affected region/corridor/component
- Assigned owner or responsible office
- Drill-in side panel or detail drawer pattern

## Required Components and Patterns

Use a consistent component system across pages:

- App shell with sidebar and top bar
- KPI cards with comparative deltas
- Section headers with concise supporting descriptions
- Line, bar, area, and stacked charts using custom CSS/SVG or lightweight patterns already feasible in the stack
- Ranked lists
- Status badges
- Trend pills
- Audit timeline
- Alert cards
- Filter bars
- Segmented controls
- Data tables only where they genuinely improve clarity
- Slide-over or drawer for detail context

Avoid cluttering the UI with too many table-heavy sections. Favor visual summaries first, then supporting detail.

## Data Model Expectations

Use realistic mock data and name things consistently. Invent believable sample values for Maputo-oriented operations.

Create mock entities such as:

- Corridors
- Toll stations or checkpoints
- Districts / zones
- Payment channels
- Revenue categories
- Enforcement teams
- Incident types
- Tariff bands
- Exemption categories
- User roles
- Alert thresholds

Mock data should support:

- Trend charts over multiple time scales
- Comparative regional performance
- Alert generation examples
- Audit history
- Config summaries

## Copy and Tone

All UI copy should be:

- English-first
- Official and concise
- Clear to non-technical government stakeholders
- Free of marketing language
- Free of startup jargon

Use terms like:

- Collected Revenue
- Revenue Target
- Collection Efficiency
- Compliance Rate
- Enforcement Coverage
- Operational Availability
- Active Tariff Policy
- Unresolved Alert
- Audit Record

## UX Rules

Follow strong admin UX and dashboard design principles:

- Prioritize scannability
- Make the most important metrics immediately visible
- Group related metrics and controls
- Use progressive disclosure for details
- Avoid overloading users with equal-weight cards
- Keep filters obvious and reversible
- Show comparison context wherever possible
- Always communicate status with text and color, not color alone
- Make empty, warning, and degraded states intentional
- Preserve consistency between chart legends, status labels, and badges
- Support keyboard navigation for major interactive controls

## Accessibility Requirements

Must include:

- Strong contrast ratios
- Clear focus states
- Semantic headings
- Descriptive labels
- Accessible status communication
- Responsive behavior that does not hide critical information
- No tiny click targets

## Implementation Constraints

- Stay within the current React + TypeScript + Vite + Tailwind + shadcn setup
- Prefer composition over pulling in many new dependencies
- Build charts in a way that matches the project constraints; avoid unnecessary library bloat
- Use mock data stored locally in code
- Keep the code modular and easy to extend later
- Replace the placeholder `App.tsx` experience fully

## Suggested Screen Details

You may use sample blocks like these:

- Executive summary ribbon with revenue health sentence
- Corridor performance matrix
- Revenue target attainment panel
- Monthly collection trend with annotations
- Compliance heatmap
- Top anomalies list
- Incident response scorecard
- Configuration summary cards with last-updated metadata
- Audit timeline grouped by day
- Alert drawer with context, severity, owner, and recommended action

## Acceptance Criteria

The prototype is successful if:

- It feels like a real internal government oversight system, not a landing page or generic template
- A user can understand revenue performance, effectiveness, and operational health within seconds
- The information hierarchy is strong across all screens
- The theme feels modern, serious, and highly usable
- The navigation is intuitive and multi-page
- The configuration area is restrained, clear, and auditable
- The UI works well on desktop and remains coherent on tablet/mobile
- Mock data is rich enough to make every page believable
- The dashboard communicates both financial outcomes and system effectiveness

## Deliverable Standard

Produce a polished prototype with thoughtful spacing, hierarchy, and content realism. Make it feel like a launch-ready concept for a Governor-level review. Do not stop at wireframe quality. The result should be visually convincing, operationally credible, and easy to navigate.
