import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true, unique: true })
  match_id: string;

  @Prop({ required: true })
  series: string;

  @Prop()
  match_number: number;

  @Prop()
  format: string;

  @Prop()
  date: string;

  @Prop()
  venue: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop({ type: Object })
  toss: any;

  @Prop({ type: Object })
  teams: any;

  @Prop({ type: Array })
  umpires: any[];

  @Prop({ type: Array })
  innings: any[];

  @Prop({ type: Object })
  result: any;

  @Prop()
  player_of_match: string;

  @Prop({ type: Array })
  top_scorers: any[];

  @Prop({ type: Array })
  top_wicket_takers: any[];

  @Prop({ type: Object })
  match_highlights: any;

  @Prop({ type: Array })
  statistics: any[];

  @Prop({ type: Array })
  commentary: any[];
}

export const MatchSchema = SchemaFactory.createForClass(Match);
