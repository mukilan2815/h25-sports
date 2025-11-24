# H25 Sports Data Hackathon Packages

**🏏⚽️ Comprehensive Sports Event Data for Hackathon Innovation**

This repository contains mock sports data packages designed for hackathon participants to develop innovative applications, analytics platforms, and real-time data processing systems.

## 📊 Available Data Packages

### 🏏 Cricket Package
**England vs Australia T20 Match - November 24, 2025**

- **Location**: `cricket-data/hackathon-package/`
- **Match**: England vs Australia T20 International
- **Events**: 57,494 total events across 10 specialized feeds
- **Duration**: Full 20-over match (129 balls)
- **Data Size**: 768KB compressed

**Feed Files:**
- Physics & ball trajectory data
- Bowler performance analytics
- Fielder positioning & movements
- Live commentary with sentiment
- Detailed wicket breakdowns
- Umpire decisions & DRS reviews
- Crowd reactions & atmosphere
- Match statistics & milestones
- Player biometric data
- Equipment sensor readings

### ⚽️ Soccer Package
**Manchester United vs Everton - Premier League 2025/26**

- **Location**: `soccer-data/hackathon-package/`
- **Match**: Manchester United vs Everton Premier League fixture
- **Events**: 7,392 total events across 7 specialized feeds
- **Duration**: 94 minutes (90 + 4 added time)
- **Data Size**: 164KB compressed
- **Final Score**: Manchester United 2-1 Everton

**Feed Files:**
- Ball physics & trajectory data
- Player performance statistics
- Player positioning & movement
- Live match commentary
- Scoring opportunities & goals
- Referee decisions & cards
- Crowd reactions & atmosphere

## 🎯 Hackathon Challenges

### Schema Development
- Design unified event processing schemas
- Build real-time data correlation pipelines
- Create fault-tolerant event aggregation systems

### Application Ideas
- **Live Score Apps**: Real-time match updates and statistics
- **Player Analytics**: Performance tracking and fatigue monitoring
- **Predictive Systems**: Wicket/goal prediction and strategic analysis
- **Fan Engagement**: Interactive experiences and betting insights
- **Tactical Analysis**: Formation analysis and player positioning
- **VAR/DRS Analysis**: Decision impact and technology reviews

## 🔗 Data Correlation

All events share common correlation fields:
```json
{
  "match_id": "unique_match_identifier",
  "timestamp": "ISO_8601_timestamp",
  "minute": "match_minute_decimal"
}
```

### Cricket Correlation Keys:
- `innings`: 1 or 2
- `over_number`: 1-20
- `ball_number`: 1-6 (within over)
- `player_id`: Consistent across feeds

### Soccer Correlation Keys:
- `possession_team`: Current ball possession
- `player_id`: Consistent player identifiers
- `event_type` + `sub_type`: Categorized event types

## 🚀 Getting Started

### For Cricket Hackathon:
```bash
cd cricket-data/
# Start with match-metadata.json
# Explore FEEDS_README.md for technical specs
# Analyze events around key moments (wickets, boundaries)
```

### For Soccer Hackathon:
```bash
cd soccer-data/
# Start with match-metadata.json
# Check FEEDS_README.md for feed documentation
# Focus on goals (minutes 23, 67, 89) and cards
```

### Development Tips:
1. **Begin with metadata** to understand match structure
2. **Sample key moments** (goals, wickets, cards, substitutions)
3. **Build correlations** using timestamps and player IDs
4. **Create aggregations** from raw event streams
5. **Test real-time processing** with event sequencing

## 💡 Example Use Cases

### Cricket Analytics:
```javascript
// Track bowler performance across overs
const bowlerEvents = bowlerStatsFeed.filter(e =>
  e.bowler_id === 'archer_j' &&
  e.event_type === 'bowler_stats'
);
const performance = analyzeBowlingStats(bowlerEvents);
```

### Soccer Analytics:
```javascript
// Analyze scoring opportunities
const shots = scoringFeed.filter(e =>
  e.sub_type === 'shot_attempt'
);
const scoringAnalysis = analyzeScoringOpportunities(shots);
