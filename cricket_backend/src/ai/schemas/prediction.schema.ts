import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PredictionDocument = Prediction & Document;

@Schema({ timestamps: true })
export class Prediction {
  @Prop({ required: true })
  match_id: string;

  @Prop({ required: true })
  team1: string;

  @Prop({ required: true })
  team2: string;

  @Prop({ required: true })
  team1WinProbability: number;

  @Prop({ required: true })
  team2WinProbability: number;

  @Prop()
  projectedScore: number;

  @Prop({ type: Array })
  keyFactors: string[];

  @Prop()
  confidence: number;

  @Prop()
  explanation: string;

  @Prop({ type: Object })
  matchContext: any;
}

export const PredictionSchema = SchemaFactory.createForClass(Prediction);
