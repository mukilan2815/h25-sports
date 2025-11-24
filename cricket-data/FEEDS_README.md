# Cricket Data Feeds - Raw Event Streams

This directory contains multiple raw event feed files designed for hackathon participants to develop schemas and processing systems. Each ball delivery is split into multiple fine-grained events across different feeds, all correlated by `ball_number`.

## Feed Files Overview

### 1. `physics-feed.json` - Ball Physics Data
**Purpose**: Raw sensor data from cricket balls, bats, and pitch
**Event Types**:
- `ball_physics.release` - Ball release metrics (speed, spin, angle)
- `ball_physics.trajectory` - Ball flight path data points
- `ball_physics.bounce` - Bounce characteristics and pitch interaction
- `ball_physics.impact` - Bat-ball contact analysis

**Sample Event**:
```json
{
    "event_id": "PHYSICS_BALL_1_RELEASE",
    "event_type": "ball_physics",
    "sub_type": "release",
    "match_id": "eng-aus-t20-2025-11-24",
    "innings": 1,
    "over_number": 1,
    "ball_number": 1,
    "release_speed_kmh": 148.2,
    "spin_rpm": 1850,
    "seam_position": "conventional"
}
```

### 2. `bowler-stats-feed.json` - Bowler Performance Data
**Purpose**: Detailed bowler analytics and biomechanical data
**Event Types**:
- `bowler_stats.pre_delivery_setup` - Run-up and positioning
- `bowler_stats.release_metrics` - Delivery execution data
- `bowler_stats.post_delivery_analysis` - Accuracy and fatigue metrics

**Key Metrics**: Release speed, spin rate, fatigue levels, accuracy scores

### 3. `fielder-feed.json` - Fielding & Positioning Data
**Purpose**: Fielder movements, positioning, and reaction times
**Event Types**:
- `fielder_data.fielding_positions` - Field placement setup
- `fielder_data.reaction_tracking` - Fielder responses to shots
- `fielder_data.fielding_action` - Catch/ground fielding execution

**Key Metrics**: Reaction times, dive angles, catch probabilities

### 4. `commentary-feed.json` - Text Commentary Stream
**Purpose**: Live commentary with sentiment analysis
**Event Types**:
- `commentary.ball_description` - Technical ball analysis
- `commentary.shot_analysis` - Batting stroke breakdown
- `commentary.over_summary` - Period summaries

**Features**: Tone analysis, emphasis detection, commentator identification

### 5. `wicket-feed.json` - Detailed Wicket Events
**Purpose**: Comprehensive wicket dismissal breakdowns
**Event Types**:
- `wicket_detail.pre_wicket_situation` - Context before wicket
- `wicket_detail.delivery_analysis` - Ball characteristics
- `wicket_detail.dismissal_mechanism` - How wicket fell
- `wicket_detail.fielder_intervention` - Fielding contribution

**Coverage**: Bowled, caught, LBW, run-out, with technology integration

### 6. `umpire-decisions-feed.json` - Umpiring Actions
**Purpose**: Umpire signals, decisions, and review processes
**Event Types**:
- `umpire_decision.ball_signal` - No-ball, wide, boundary calls
- `umpire_decision.wicket_signal` - Out/not out decisions
- `umpire_decision.review_process` - DRS technology usage

### 7. `crowd-reactions-feed.json` - Stadium Atmosphere
**Purpose**: Crowd noise, reactions, and sentiment
**Event Types**:
- `crowd_reaction.ball_delivery` - General crowd response
- `crowd_reaction.boundary_celebration` - Six/four reactions
- `crowd_reaction.wicket_reaction` - Dismissal responses

**Metrics**: Noise levels, cheer intensity, movement patterns

### 8. `match-statistics-feed.json` - Live Match Stats
**Purpose**: Running statistics and match analysis
**Event Types**:
- `match_statistics.over_completion` - Over-by-over updates
- `match_statistics.wicket_fall` - Wicket impact analysis
- `match_statistics.chase_progress` - Run chase metrics

### 9. `player-biometric-feed.json` - Player Physiology
**Purpose**: Heart rate, fatigue, stress levels
**Event Types**:
- `player_biometric.pre_delivery_readings` - Bowler preparation
- `player_biometric.shot_execution` - Batsman reaction times
- `player_biometric.wicket_celebration` - Emotional responses

**Metrics**: Heart rate, stress hormones, fatigue indices

### 10. `equipment-sensor-feed.json` - Equipment Sensors
**Purpose**: Bat, ball, wicket, and gear sensor data
**Event Types**:
- `equipment_sensor.cricket_ball_sensors` - Ball condition/tracking
- `equipment_sensor.bat_sensors` - Bat impact and swing data
- `equipment_sensor.wicket_sensors` - Stump displacement
- `equipment_sensor.fielding_equipment` - Glove/catch sensors

## Data Correlation

All events across feeds share these common fields for correlation:
- `match_id` - Unique match identifier
- `innings` - Innings number (1 or 2)
- `over_number` - Over number (1-20)
- `ball_number` - Ball number within over (1-6, plus extras)

## Hackathon Challenges

### Schema Development
- Design unified schemas for each event type
- Create aggregation pipelines for ball-level summaries
- Develop real-time processing architectures

### Data Processing
- Implement event correlation across feeds
- Build wicket prediction models
- Create player performance analytics

### Real-time Applications
- Live match commentary generation
- Predictive analytics for coaches
- Fan engagement features

## Event Volume

- **Total Events**: **85,551** across all feeds
- **Expanded Coverage**: Physics, Bowler Stats, and Commentary feeds now cover **all 129 balls** of Australia innings
- **Physics Events**: **516** (4 per ball × 129 balls)
- **Bowler Stats Events**: **387** (3 per ball × 129 balls)
- **Commentary Events**: **258** (2 per ball × 129 balls)
- **Wicket Events**: ~225 (detailed breakdown per wicket)
- **Biometric Events**: ~75 (key moments)
- **Events Per Ball**: Average **538 events per ball** for expanded feeds

## Sample Use Cases

1. **Ball Tracking**: Combine physics + fielder feeds for shot prediction
2. **Player Fatigue**: Monitor biometric + bowler stats for rotation decisions
3. **Wicket Analysis**: Correlate wicket + equipment feeds for technology validation
4. **Crowd Analytics**: Link commentary + crowd feeds for atmosphere modeling
5. **Performance Analytics**: Aggregate statistics + biometric feeds for player insights

## Data Quality Notes

- All events are simulated but realistic cricket data
- Timestamps are sequential and ball-correlated
- Sensor data includes appropriate noise and variation
- Missing data points reflect real-world sensor limitations
- Event correlation maintained through shared identifiers
